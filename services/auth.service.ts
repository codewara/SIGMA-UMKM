import { connectCassandra, connectMongo } from "@/lib/db";
import { transporter } from "@/lib/mailer";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "mongodb";
import bcrypt from "bcrypt";

// Authenticate User
export async function authenticateUser(email: string, pass: string, ip: string, userAgent: string) {
    const [mongo, cassandra] = await Promise.all([connectMongo(), connectCassandra()]);

    // Rate Limiting
    const rateCheck = await cassandra.execute(
        'SELECT attempt_count FROM login_attempts WHERE ip_address = ?',
        [ip], { prepare: true }
    );
    const attempts = rateCheck.first()?.attempt_count?.toNumber() || 0;
    if (attempts > 5) throw new Error("TOO_MANY_ATTEMPTS"); // Rate limit exceeded

    // Verify Credentials
    const user = await mongo.collection("users").findOne({ email });
    const isValid = user && await bcrypt.compare(pass, user.password_hash);

    if (!isValid) {
        await Promise.all([
            // Increment Failure Counter
            cassandra.execute(
                'UPDATE login_attempts SET attempt_count = attempt_count + 1 WHERE ip_address = ?',
                [ip], { prepare: true }
            ),

            // Log Audit
            cassandra.execute(
                'INSERT INTO login_logs (user_id, login_time, status, ip_address, device_info) VALUES (?, toTimestamp(now()), ?, ?, ?)',
                [user ? user._id.toString() : "00000000-0000-0000-0000-000000000000", 'failed', ip, userAgent], { prepare: true }
            )
        ]);
        return null;
    }

    // Reset Failure Counter
    if (attempts > 0) {
        await cassandra.execute(
            'UPDATE login_attempts SET attempt_count = attempt_count - ? WHERE ip_address = ?',
            [attempts, ip], { prepare: true }
        );
    }

    // Create Session
    const sessionToken = uuidv4();
    const cookieStore = await cookies();
    cookieStore.set("session_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 24 * 60 * 60 // 24 hours
    });

    // Store Session
    await mongo.collection("sessions").insertOne({
        // @ts-expect-error cast _id to UUID
        _id: new UUID(sessionToken),
        user_id: user._id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    });

    // Log Audit
    cassandra.execute(
        'INSERT INTO login_logs (user_id, login_time, status, ip_address, device_info) VALUES (?, toTimestamp(now()), ?, ?, ?)',
        [user._id.toString(), 'success', ip, userAgent], { prepare: true }
    );

    return { user, token: sessionToken };
}

// Logout User
export async function logoutUser(sessionToken: string) {
    const [mongo, cookieStore] = await Promise.all([connectMongo(), cookies()]);

    cookieStore.delete("session_token");
    await mongo.collection("sessions").deleteOne({
        // @ts-expect-error cast _id to UUID
        _id: new UUID(sessionToken)
    });
}

// Register User
export async function registerUser(
    email: string,
    pass: string,
    role: "ADMIN" | "PEJABAT" | "UMKM_OWNER",
    profile?: { nama_lengkap: string; nik: string; telepon: string }
) {
    const mongo = await connectMongo();

    const existingUser = await mongo.collection("users").findOne({ email });
    if (existingUser) throw new Error("USER_EXISTS");

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(pass, 12);

    const userData: any = {
        // @ts-expect-error cast _id to UUID
        _id: new UUID(userId),
        email: email,
        password_hash: hashedPassword,
        role: role,
        account_status: "unverified",
        created_at: new Date(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    // Add profile for UMKM_OWNER
    if (role === "UMKM_OWNER" && profile) {
        userData.profile = profile;
    }

    await mongo.collection("users").insertOne(userData);
    const token = await generateToken(userId, "email_verification");

    try {
        await sendEmail(email, token);
    } catch (emailError) {
        console.warn("Email sending failed (SMTP not configured):", emailError);
        // Continue - user is created, email can be sent later
    }

    return { userId };
}

// Generate Temporary Token
export async function generateToken(userId: string, type: string) {
    const cassandra = await connectCassandra();
    const token = uuidv4();

    await cassandra.execute(
        'INSERT INTO temp_tokens (token_value, user_id, purpose) VALUES (?, ?, ?)',
        [token, userId, type], { prepare: true }
    );
    return token;
}

// Send Verification Email
export async function sendEmail(to: string, token: string) {
    await transporter.sendMail({
        from: "SIGMA UMKM <no-reply@sigma-umkm.com>",
        to,
        subject: "SIGMA UMKM - Verify Your Email",
        html: `
        <p>
          Please verify your email by clicking the following link:
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}">
            Verify Email
          </a>
        </p>
        `,
    });
}

// Email Verification
export async function verifyEmail(token: string) {
    const [mongo, cassandra] = await Promise.all([connectMongo(), connectCassandra()]);

    const result = await cassandra.execute(
        'SELECT user_id FROM temp_tokens WHERE token_value = ?',
        [token], { prepare: true }
    );

    if (!result.rows.length) throw new Error("INVALID_TOKEN");
    const userId = result.rows[0].user_id;

    await mongo.collection("users").updateOne(
        // @ts-expect-error cast _id to UUID
        { _id: new UUID(userId.toString()) },
        { $set: { account_status: "active" }, $unset: { expires_at: "" } }
    );
}
