import "dotenv/config"; // Ensure environment variables are loaded FIRST
import pg from "pg";

const { Pool } = pg;

const neonConnectionString = process.env.DATABASE_URL;

if (!neonConnectionString) {
  throw new Error("DATABASE_URL environment variable is undefined or missing.");
}

// Create a connection pool for Neon PostgreSQL
export const neonPool = new Pool({
  connectionString: neonConnectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon cloud SSL connections
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10s to account for Neon cold starts
});

// Helper function to execute queries
export const query = async (
  text: string,
  params?: any[]
): Promise<{ rows: any[]; fields: any[] }> => {
  const start = Date.now();
  const res = await neonPool.query(text, params);
  const duration = Date.now() - start;
  console.log("Executed query", { text, duration, rows: res.rowCount });
  return res;
};

// Helper function to execute a single query and return rows
export const queryRows = async <T = any>(
  text: string,
  params?: any[]
): Promise<T[]> => {
  const res = await neonPool.query(text, params);
  return res.rows as T[];
};

// Helper function to execute a single query and return a single row
export const queryRow = async <T = any>(
  text: string,
  params?: any[]
): Promise<T | undefined> => {
  const res = await neonPool.query(text, params);
  return res.rows[0] as T;
};

// Close the pool (useful for graceful shutdown)
export const closePool = async (): Promise<void> => {
  await neonPool.end();
};