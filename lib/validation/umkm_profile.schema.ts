import  { z } from 'zod';

export const umkmProfileSchema = z.object({
    nama_usaha: z.string().min(1, "Nama usaha tidak boleh kosong"),
    sektor: z.string().min(1, "Sektor tidak boleh kosong"),

    pemilik: z.object({
        nama: z.string().min(1, "Nama pemilik tidak boleh kosong"),
        nik: z.
            string().
            length(16, "NIK harus terdiri dari 16 digit").
            regex(/^[0-9]+$/, "NIK harus angka"),
        telepon: z.
            string().
            min(10, "Nomor terlalu pendek").
            regex(/^[0-9+]+$/, "Nomor telepon tidak valid"),
        email: z.string().email("Email tidak valid"),
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
    alamat_lengkap: z.string(),
  }),

  legalitas: z
    .object({
      nib: z.string().optional(),
      pirt: z.string().optional(),
      halal: z.boolean().optional(),
    })
    .optional(),
});

export const umkmUpdateSchema = z.object({
  nama_usaha: z.string().optional(),
  sektor: z.string().optional(),

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
    halal: z.boolean().optional()
  }).optional()
});