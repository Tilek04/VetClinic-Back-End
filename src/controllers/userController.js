import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const userRegister = async (req, res) => {
  const { name, email, password, role } = req.body;

  const validRoles = ["doctor", "manager", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role!" });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Fill in all fields!" });
  }

  try {
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users(name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, hashedPassword, role || "patient"]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error!" });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Fill in all fields!" });
  }

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );
    return res.json({ user, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error!" });
  }
};

export const confirmRole = async (req, res) => {
  const { userId, role } = req.body;

  const validRoles = ["doctor", "manager", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role!" });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET role = $1, verified = true WHERE id = $2 RETURNING *`,
      [role, userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error!" });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, verified FROM users WHERE role IN ('doctor', 'manager', 'admin')`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error!" });
  }
};

export const getUsers = async (req, res) => {
  console.log("Attempting to fetch users...");

  try {
    console.log("Executing database query...");
    const result = await pool.query(`SELECT id, name, email, role FROM users`);
    console.log("Database query successful, result:");
    res.json(result.rows);
  } catch (error) {
    console.error("Error during database query:", error.message);
    res.status(500).json({ message: "GetUser error!" });
  }
};
