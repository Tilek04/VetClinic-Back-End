import express from "express";
import { getUsers, userRegister } from "../controllers/userController.js"; 

const router = express.Router();

router.post("/register", userRegister);
router.get("/", getUsers)
router.post("/login", userLogin)

export default router;
