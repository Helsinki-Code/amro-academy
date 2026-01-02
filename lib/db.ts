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
      
      if (!password) {
        throw new Error('DB_PASSWORD environment variable is required. Please set it in your .env file.');
      }
      
      // Handle Cloud SQL Unix socket connection
      if (host.startsWith('/cloudsql/')) {
        connectionString = `postgresql://${user}:${encodeURIComponent(password)}@/${database}?host=${host}`;
      } else {
        connectionString = `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
      }
    }
    
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
  
  return pool;
}

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const pool = getDbPool();
  return pool.query<T>(text, params);
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

