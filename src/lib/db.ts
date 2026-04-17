import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000, // 5 seconds timeout
});

let initialized = false;

export async function query(text: string, params?: any[]) {
  try {
    if (!initialized) {
      await initDb();
    }
    return await pool.query(text, params);
  } catch (err) {
    console.error('Database query error:', err);
    // On Vercel, if the connection dies, we might need to reset initialized
    // but usually the process just restarts.
    throw err;
  }
}

export async function initDb() {
  if (initialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        quiz_answers JSONB NOT NULL,
        acknowledged_dislikes JSONB NOT NULL,
        extra_note TEXT
      )
    `);
    initialized = true;
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }
}

export default pool;

