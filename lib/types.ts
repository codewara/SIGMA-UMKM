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

export interface FinancialLog {
    umkm_id: string;
    bulan: number;
    tahun: number;
    omzet: number;
    pengeluaran: number;
    laba: number;
    tanggal_input: Date;
    is_flagged?: boolean;
    flag_reason?: string;
}
