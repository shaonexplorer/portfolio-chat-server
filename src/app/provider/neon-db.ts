import { Pool } from "pg";

const neonConnectionString = process.env.DATABASE_URL as string;

// Create a connection pool for Neon PostgreSQL
export const neonPool = new Pool({
  connectionString: neonConnectionString,
  // Neon serverless recommendations
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
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