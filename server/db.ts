import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Setup WebSocket for Neon serverless connection
neonConfig.webSocketConstructor = ws;

// Note: Some NeonDB connection parameters are only available in newer versions
// We'll use our custom retry mechanism in storage.ts for reliability

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,               // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection not established
  maxUses: 100           // Close and replace a connection after it has been used 100 times
});

// Add pool error handling
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle({ client: pool, schema });
