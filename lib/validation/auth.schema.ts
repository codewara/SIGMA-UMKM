import { z } from "zod";

/**
 * Validation schemas for user authentication and registration
 */

// Login schema
export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration schema for UMKM_OWNER (simple validation for prototype)
export const registerOwnerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.literal("UMKM_OWNER"),
    profile: z.object({
        nama_lengkap: z.string().min(1, "Full name is required"),
        nik: z.string()
            .length(16, "NIK must be 16 digits")
            .regex(/^[0-9]+$/, "NIK must contain only numbers"),
        telepon: z.string()
            .min(10, "Phone number too short")
            .regex(/^[0-9+]+$/, "Invalid phone number format"),
    }),
});

// Email verification schema
export const emailVerificationSchema = z.object({
    token: z.string().uuid("Invalid verification token"),
});

// Verification decision schema (for PEJABAT/ADMIN)
export const verificationDecisionSchema = z.object({
    notes: z.string().max(500).optional(),
});

export const rejectionSchema = z.object({
    reason: z.string()
        .min(10, "Rejection reason must be at least 10 characters")
        .max(500, "Rejection reason must not exceed 500 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type VerificationDecisionInput = z.infer<typeof verificationDecisionSchema>;
export type RejectionInput = z.infer<typeof rejectionSchema>;
