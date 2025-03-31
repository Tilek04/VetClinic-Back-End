import express from "express";
import {
  confirmRole,
  getUsers,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/register", userRegister);
router.get("/", getUsers);
router.post("/login", userLogin);
router.post("/confirm-role", isAdmin, confirmRole);

export default router;
