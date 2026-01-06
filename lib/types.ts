import { Db, MongoClient } from "mongodb";
import cassandra from "cassandra-driver";

export interface GlobalDB {
    mongoClient?: MongoClient;
    mongoDb?: Db;
    cassandraClient?: cassandra.Client;
}