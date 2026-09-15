import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

// 1. Create a pg Pool instance
const pool = new pg.Pool({ connectionString });

// 2. Pass the Pool instance to PrismaPg driver adapter
const adapter = new PrismaPg(pool);

// 3. Pass adapter to PrismaClient
const prisma = new PrismaClient({ adapter });

export { prisma };
