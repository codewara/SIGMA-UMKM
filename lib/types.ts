import { Db, MongoClient } from "mongodb";
import cassandra from "cassandra-driver";

export interface GlobalDB {
    mongoClient?: MongoClient;
    mongoDb?: Db;
    cassandraClient?: cassandra.Client;
}

export type UserRole = "PUBLIC" | "UMKM_OWNER" | "PEJABAT" | "ADMIN";

export interface UMKMProfile {
    _id?: string;
    owner_id: string;
    nama_usaha: string;
    sektor: "kuliner" | "fashion" | "kriya" | "jasa" | "lainnya";
    tanggal_bergabung: Date;
    verification_status: "PENDING" | "APPROVED" | "REJECTED";
    pemilik: {
        nama: string;
        nik: string;
        telepon: string;
        email: string;
    };
    lokasi: {
        type: string;
        coordinates: [number, number];
    };
    wilayah: {
        kota: string;
        provinsi: string;
        alamat_lengkap: string;
    };
    legalitas: {
        nib?: string;
        pirt?: string;
        halal?: boolean;
    };
    summary_terakhir: {
        omzet_terakhir: number;
        bulan: number;
    };
}

// Client-side types
export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'PEJABAT' | 'UMKM_OWNER';
}

export interface UMKM {
    id: string;
    name: string;
    category: string;
    location: string;
    revenue: string;
    growth: string;
    status: string;
    icon: string;
    badge: string;
    // Additional fields from API
    wilayah?: {
        kota: string;
        provinsi: string;
        alamat_lengkap: string;
    };
    tanggal_bergabung?: Date;
    pemilik?: {
        nama: string;
        nik: string;
        telepon: string;
        email: string;
    };
    legalitas?: {
        nib: string;
        pirt: string;
        halal: boolean;
        status_verifikasi: string;
    };
    is_deleted?: boolean;
    omzet_terakhir?: number;
    bulan?: number;
}
