import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Fill in the field!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users(name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, hashedPassword, role || "patient"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error!" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, email, role FROM users`);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "GetUser error!" });
  }
};
