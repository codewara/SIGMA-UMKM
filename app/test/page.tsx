'use client'
import { useEffect, useState } from "react";

export default function Page() {
  const [mongoResponse, setMongoResponse] = useState("Loading MongoDB response...");
  const [cassandraResponse, setCassandraResponse] = useState("Loading Cassandra response...");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mongoRes = await fetch("/api/test?type=mongo");
        const mongoData = await mongoRes.json();
        console.log("Mongo Response:", mongoData);
        setMongoResponse(JSON.stringify(mongoData, null, 2));

        const cassandraRes = await fetch("/api/test?type=cassandra");
        const cassandraData = await cassandraRes.json();
        console.log("Cassandra Response:", cassandraData);
        setCassandraResponse(JSON.stringify(cassandraData, null, 2));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <div className="flex w-full gap-4">
        <div className="flex flex-col w-1/2">
          <h2 className="mb-2">
            MongoDB Response
          </h2>
          <pre className="overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <code>{mongoResponse}</code>
          </pre>
        </div>
        <div className="flex flex-col w-1/2">
          <h2 className="mb-2">
            Cassandra Response
          </h2>
          <pre className="overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <code>{cassandraResponse}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}