import express from "express";
import {
  registerUser,
  loginUser,
  verifyTokenController,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

//register

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verifyToken", verifyToken, verifyTokenController);

export default router;
