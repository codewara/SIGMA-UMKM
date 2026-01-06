import { z } from "zod";

export const umkmFinancialLogSchema = z.object({
  tahun: z
    .number()
    .int(),
  bulan: z
    .number()
    .int()
    .min(1, "bulan minimal 1")
    .max(12, "bulan maksimal 12"),
  omzet: z
    .number()
    .nonnegative("omzet tidak boleh negatif"),
  jumlah_karyawan: z
    .number()
    .int()
    .nonnegative("jumlah karyawan tidak boleh negatif"),
  nama_usaha: z
    .string()
    .min(2, "nama usaha terlalu pendek"),
  sektor: z
    .string()
    .min(2, "sektor tidak valid")
});

export const umkmFinancialLogUpdateSchema = umkmFinancialLogSchema.partial();