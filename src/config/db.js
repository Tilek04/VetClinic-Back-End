import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); 


const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false }, // Если база на Render
});

console.log("PG_DATABASE_URL:", process.env.PG_DATABASE_URL);
