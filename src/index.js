import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/userRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/users", router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
