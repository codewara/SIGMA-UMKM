import { Db, MongoClient } from "mongodb";
import cassandra from "cassandra-driver";

export interface GlobalDB {
    mongoClient?: MongoClient;
    mongoDb?: Db;
    cassandraClient?: cassandra.Client;
}

export interface UMKMProfile {
    nama_usaha: string;
    sektor: "kuliner" | "fashion" | "kriya" | "jasa" | "lainnya";
    tanggal_bergabung: Date;
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
