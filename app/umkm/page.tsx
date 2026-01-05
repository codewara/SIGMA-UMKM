'use client'
import { useState } from "react";
import { umkmProfileSchema } from "@/lib/validation/umkm_profile.schema";

export default function Page() {
  const [form, setForm] = useState({
    nama_usaha: "",
    sektor: "",
    nama_pemilik: "",
    nik: "",
    telepon: "",
    email: "",
    kota: "",
    provinsi: "",
    alamat_lengkap: "",
    lng: "",
    lat: "",
    nib: "",
    pirt: "",
    halal: false
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const payload = {
      nama_usaha: form.nama_usaha,
      sektor: form.sektor,
      pemilik: {
        nama: form.nama_pemilik,
        nik: form.nik,
        telepon: form.telepon,
        email: form.email
      },
      wilayah: {
        kota: form.kota,
        provinsi: form.provinsi,
        alamat_lengkap: form.alamat_lengkap
      },
      lokasi: form.lng && form.lat
        ? { type: "Point", coordinates: [Number(form.lng), Number(form.lat)] }
        : undefined,
      legalitas: form.nib || form.pirt || form.halal
        ? { nib: form.nib || undefined, pirt: form.pirt || undefined, halal: form.halal }
        : undefined
    };

    // 🔎 validasi zod di frontend
    const result = umkmProfileSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((i) => (fieldErrors[i.path.join(".")] = i.message));
      setErrors(fieldErrors);
      setStatus({ type: "error", message: "Periksa kembali form kamu." });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      setStatus({ type: "success", message: "UMKM berhasil didaftarkan 🎉" });

      // 🔄 reset form setelah berhasil
      setForm({
        nama_usaha: "",
        sektor: "",
        nama_pemilik: "",
        nik: "",
        telepon: "",
        email: "",
        kota: "",
        provinsi: "",
        alamat_lengkap: "",
        lng: "",
        lat: "",
        nib: "",
        pirt: "",
        halal: false
      });
    } catch (err) {
      setStatus({ type: "error", message: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-4">
      <h1 className="text-2xl font-bold">Registrasi UMKM</h1>

      {/* 🔔 Notifikasi */}
      {status.message && (
        <div
          className={`p-3 rounded ${
            status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow p-6 rounded-xl">

        {/* DATA UMKM */}
        <section>
          <h2 className="font-semibold mb-2">Data UMKM</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field name="nama_usaha" value={form.nama_usaha} onChange={handleChange}
                   label="Nama Usaha" error={errors["nama_usaha"]} />
            <Field name="sektor" value={form.sektor} onChange={handleChange}
                   label="Sektor" error={errors["sektor"]} />
          </div>
        </section>

        {/* PEMILIK */}
        <section>
          <h2 className="font-semibold mb-2">Pemilik</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field name="nama_pemilik" label="Nama Pemilik" value={form.nama_pemilik}
                   onChange={handleChange} error={errors["pemilik.nama"]} />

            <Field name="nik" label="NIK (16 digit)" value={form.nik}
                   onChange={handleChange} error={errors["pemilik.nik"]} />

            <Field name="telepon" label="Telepon" value={form.telepon}
                   onChange={handleChange} error={errors["pemilik.telepon"]} />

            <Field name="email" label="Email" value={form.email}
                   onChange={handleChange} error={errors["pemilik.email"]} />
          </div>
        </section>

        {/* WILAYAH */}
        <section>
          <h2 className="font-semibold mb-2">Wilayah</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field name="kota" label="Kota" value={form.kota}
                   onChange={handleChange} error={errors["wilayah.kota"]} />

            <Field name="provinsi" label="Provinsi" value={form.provinsi}
                   onChange={handleChange} error={errors["wilayah.provinsi"]} />

            <Field name="alamat_lengkap" label="Alamat Lengkap"
                   value={form.alamat_lengkap} onChange={handleChange}
                   error={errors["wilayah.alamat_lengkap"]} className="col-span-2" />
          </div>
        </section>

        {/* LOKASI */}
        <section>
          <h2 className="font-semibold mb-2">Lokasi (opsional)</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field name="lng" label="Longitude" value={form.lng} onChange={handleChange} />
            <Field name="lat" label="Latitude" value={form.lat} onChange={handleChange} />
          </div>
        </section>

        {/* LEGALITAS */}
        <section>
          <h2 className="font-semibold mb-2">Legalitas (opsional)</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field name="nib" label="NIB" value={form.nib} onChange={handleChange} />
            <Field name="pirt" label="PIRT" value={form.pirt} onChange={handleChange} />
          </div>

          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="halal" checked={form.halal} onChange={handleChange} />
            Sertifikasi Halal
          </label>
        </section>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}

/** Reusable input + error component **/
function Field({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="text-sm text-gray-700">{label}</label>
      <input
        className={`border p-2 w-full rounded mt-1 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}