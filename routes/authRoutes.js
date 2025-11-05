import registerUser from "../controllers/authController.js";
import express from "express";

const router = express.Router();

//register

router.post("/register", registerUser);
export default router;
