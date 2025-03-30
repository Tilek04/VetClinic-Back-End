import express from "express";
import { getUsers, userRegister } from "../controllers/userController.js"; // Проверьте правильность пути

const router = express.Router();

router.post("/register", userRegister);
router.get("/", getUsers)

export default router;
