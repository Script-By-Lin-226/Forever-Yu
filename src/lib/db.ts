import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

let initialized = false;

export async function query(text: string, params?: any[]) {
  if (!initialized) {
    await initDb();
  }
  return pool.query(text, params);
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

