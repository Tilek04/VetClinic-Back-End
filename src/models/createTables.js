import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.PG_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const createTables = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) CHECK (role IN ('patient', 'doctor', 'manager', 'admin')) NOT NULL DEFAULT 'patient',
      verified BOOLEAN DEFAULT false
    );
  `;

  try {
    await pool.query(query);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating table:", err.message);
  } finally {
    pool.end();
  }
};

createTables();
