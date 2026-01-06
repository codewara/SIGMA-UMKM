import { connectCassandra, connectMongo } from "@/lib/db";
import { transporter } from "@/lib/mailer";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "mongodb";
import bcrypt from "bcrypt";

// Authenticate User
export async function authenticateUser(email: string, pass: string, ip: string, userAgent: string) {
    const mongo = await connectMongo();
    const cassandra = await connectCassandra();

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
        // Increment Failure Counter
        await cassandra.execute(
            'UPDATE login_attempts SET attempt_count = attempt_count + 1 WHERE ip_address = ?', 
            [ip], { prepare: true }
        );

        // Log Audit
        await cassandra.execute(
            'INSERT INTO login_logs (user_id, login_time, status, ip_address, device_info) VALUES (?, toTimestamp(now()), ?, ?, ?)',
            [user ? user._id : uuidv4(), 'failed', ip, userAgent], { prepare: true }
        );
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

    return { token: sessionToken, user: { email: user.email, role: user.role } };
}

// Register User
export async function registerUser(email: string, pass: string) {
    const mongo = await connectMongo();

    const existingUser = await mongo.collection("users").findOne({ email });
    if (existingUser) throw new Error("USER_EXISTS");

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(pass, 12);
    
    await mongo.collection("users").insertOne({
        // @ts-expect-error cast _id to UUID
        _id: new UUID(userId),
        email: email,
        password_hash: hashedPassword,
        role: "UMKM_OWNER",
        account_status: "unverified",
        created_at: new Date(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return { userId };
}
