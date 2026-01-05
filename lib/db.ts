import { Pool, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    let connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      const host = process.env.DB_HOST || 'localhost';
      const user = process.env.DB_USER || 'amroacademyuser';
      const password = process.env.DB_PASSWORD;
      const database = process.env.DB_NAME || 'amroacademy';
      const port = process.env.DB_PORT || '5432';
      
      if (!password && !process.env.DATABASE_URL) {
        // Don't throw during initialization - let it fail gracefully on first query
        console.error('Database configuration error: DB_PASSWORD or DATABASE_URL is required');
        // Create a pool that will fail on first query, but don't throw here
        connectionString = `postgresql://${user}:@${host}:${port}/${database}`;
      } else if (password) {
        // Handle Cloud SQL Unix socket connection
        if (host.startsWith('/cloudsql/')) {
          connectionString = `postgresql://${user}:${encodeURIComponent(password)}@/${database}?host=${host}`;
        } else {
          connectionString = `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
        }
      }
    }
    
    if (connectionString) {
      pool = new Pool({
        connectionString,
        ssl: process.env.DB_HOST && !process.env.DB_HOST.startsWith('/cloudsql/') && process.env.DB_HOST !== 'localhost' ? {
          rejectUnauthorized: false,
        } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // Increased to 10 seconds for Cloud SQL public IP
      });
    }
  }
  
  if (!pool) {
    throw new Error('Database pool not initialized. Please check DATABASE_URL or DB_PASSWORD environment variables.');
  }
  
  return pool;
}

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  try {
    const pool = getDbPool();
    return await pool.query<T>(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

