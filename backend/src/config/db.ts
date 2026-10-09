import pg from 'pg';
import { config } from './index.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const testDbConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT NOW()');
      console.log('🐘 PostgreSQL connected successfully at:', res.rows[0].now);
      return true;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('❌ PostgreSQL connection failed:', error.message || error);
    return false;
  }
};

export default pool;
