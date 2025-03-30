import express from "express";
import { userRegister } from "../controllers/userController.js"; // Проверьте правильность пути

const router = express.Router();

router.post("/register", userRegister);

export default router;
