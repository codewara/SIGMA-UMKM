import { z } from "zod";

/**
 * Validation schemas for financial data operations
 */

// Revenue input schema for UMKM_OWNER
export const revenueInputSchema = z.object({
    tahun: z.number().int().min(2020).max(2050),
    bulan: z.number().int().min(1).max(12),
    omzet: z.number().positive("Omzet must be a positive number"),
    jumlah_karyawan: z.number().int().min(0).optional(),
    bukti_url: z.string().url("Invalid URL format").optional(),
});

// Flag data schema for PEJABAT
export const flagDataSchema = z.object({
    reason: z.string()
        .min(10, "Reason must be at least 10 characters")
        .max(500, "Reason must not exceed 500 characters"),
});

// Un flag data (remove flag)
export const unflagDataSchema = z.object({
    notes: z.string().max(500).optional(),
});

// Financial query parameters
export const financialQuerySchema = z.object({
    tahun: z.coerce.number().int().min(2020).max(2050).optional(),
    bulan: z.coerce.number().int().min(1).max(12).optional(),
});

export type RevenueInput = z.infer<typeof revenueInputSchema>;
export type FlagData = z.infer<typeof flagDataSchema>;
export type FinancialQuery = z.infer<typeof financialQuerySchema>;
