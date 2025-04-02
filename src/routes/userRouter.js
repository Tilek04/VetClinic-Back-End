import express from "express";
import {
  confirmRole,
  getEmployees,
  getUsers,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import isAdmin from "../middleware/isAdmin.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.get("/", getUsers);
router.post("/login", userLogin);
router.post("/confirm-role", authMiddleware, isAdmin, confirmRole);
router.get("/employees", authMiddleware, isAdmin, getEmployees);

export default router;
