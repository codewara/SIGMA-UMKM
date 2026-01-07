import { z } from 'zod';

export const umkmProfileSchema = z.object({
  nama_usaha: z.string().min(1, "Nama usaha tidak boleh kosong"),
  sektor: z.string().min(1, "Sektor tidak boleh kosong"),
  owner_id: z.string().uuid().optional(), // Link to users collection

  pemilik: z.object({
    nama: z.string().min(1, "Nama pemilik tidak boleh kosong"),
    nik: z.
      string().
      length(16, "NIK harus terdiri dari 16 digit").
      regex(/^[0-9]+$/, "NIK harus angka").optional(),
    telepon: z.
      string().
      min(10, "Nomor terlalu pendek").
      regex(/^[0-9+]+$/, "Nomor telepon tidak valid"),
    email: z.string().email("Email tidak valid").optional(),
  }),
  lokasi: z.
    object({
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
        .length(2, "Koordinat harus [lng, lat]"),
    })
    .optional(),

  wilayah: z.object({
    kota: z.string(),
    provinsi: z.string(),
    alamat_lengkap: z.string().optional(),
  }),

  legalitas: z
    .object({
      nib: z.string().optional(),
      pirt: z.string().optional(),
      halal: z.boolean().optional(),
      dokumen_url: z.string().url().optional(),
      status_verifikasi: z.enum(["PENDING", "VERIFIED", "REJECTED"]).default("PENDING"),
      verified_by: z.string().uuid().optional(),
      tanggal_verifikasi: z.date().optional(),
      rejection_reason: z.string().optional(),
    })
    .optional(),
});

export const umkmUpdateSchema = z.object({
  nama_usaha: z.string().optional(),
  sektor: z.string().optional(),
  owner_id: z.string().uuid().optional(),

  pemilik: z.object({
    nama: z.string().optional(),
    nik: z.string().optional(),
    telepon: z.string().optional(),
    email: z.string().optional()
  }).optional(),

  lokasi: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2)
  }).optional(),

  wilayah: z.object({
    kota: z.string().optional(),
    provinsi: z.string().optional(),
    alamat_lengkap: z.string().optional()
  }).optional(),

  legalitas: z.object({
    nib: z.string().optional(),
    pirt: z.string().optional(),
    halal: z.boolean().optional(),
    dokumen_url: z.string().url().optional(),
    status_verifikasi: z.enum(["PENDING", "VERIFIED", "REJECTED"]).optional(),
    rejection_reason: z.string().optional()
  }).optional()
});