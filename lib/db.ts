import { Db, MongoClient, ServerApiVersion } from "mongodb";
import cassandra from 'cassandra-driver';

const MONGO_URI = process.env.MONGO_URI;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;
const CASSANDRA_KEYSPACE = process.env.CASSANDRA_KEYSPACE;
const CASSANDRA_CONTACT_POINTS = process.env.CASSANDRA_CONTACT_POINTS ? process.env.CASSANDRA_CONTACT_POINTS.split(',') : [];
const CASSANDRA_LOCAL_DATACENTER = process.env.CASSANDRA_LOCAL_DATACENTER;

if (!MONGO_URI) throw new Error("MONGO_URI is not defined in environment variables");
if (!MONGO_COLLECTION) throw new Error("MONGO_COLLECTION is not defined in environment variables");
if (!CASSANDRA_KEYSPACE) throw new Error("CASSANDRA_KEYSPACE is not defined in environment variables");
if (CASSANDRA_CONTACT_POINTS.length === 0) throw new Error("CASSANDRA_CONTACT_POINTS is not defined in environment variables");
if (!CASSANDRA_LOCAL_DATACENTER) throw new Error("CASSANDRA_LOCAL_DATACENTER is not defined in environment variables");

const mongoClient = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    connectTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

let mongoInstance: Db | null = null;

export async function connectMongo(): Promise<Db> {
    if (mongoInstance) return mongoInstance;

    try {
        await mongoClient.connect();
        await mongoClient.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB");
        mongoInstance = mongoClient.db(MONGO_COLLECTION);
        return mongoInstance;
    } catch (error) {
        console.error("DB Connection Error:", error);
        throw error;
    }
}

export async function closeMongo() {
    await mongoClient.close();
}

const cassandraClient = new cassandra.Client({
    keyspace: CASSANDRA_KEYSPACE,
    contactPoints: CASSANDRA_CONTACT_POINTS,
    localDataCenter: CASSANDRA_LOCAL_DATACENTER,
    queryOptions: { prepare: true },
});

export async function connectCassandra(): Promise<cassandra.Client> {
    try {
        await cassandraClient.connect();
        console.log("Connected to Cassandra");
        return cassandraClient;
    } catch (error) {
        console.error("Cassandra Connection Error:", error);
        throw error;
    }
}

export async function closeCassandra() {
    await cassandraClient.shutdown();
}