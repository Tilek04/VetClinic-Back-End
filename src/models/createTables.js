import { Pool } from "pool";
import dotenv from "dotenv";
import { connectionString } from "pg/lib/defaults";

dotenv.config();


const pool = new Pool({
    connectionString: process.env.PG_DATABASE_URL
})