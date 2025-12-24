import Frontend_Users from "../../modals/frontendUsersModal.js";
import bcrypt from "bcryptjs";
import { generatedToken } from "../../middleware/jwt.js";
import mongoose from "mongoose";

//! AUTH
// register

export const registerFrontendUser = async (req, res) => {
  try {
    if (req.body == null) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty",
      });
    }

    // CASE 2 — req.body exists but is empty {}
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No user data is provided",
      });
    }
    const { name, email, password } = req.body;
    console.log("api hit");

    if (!name) {
      return res.status(400).json({ success: false, message: "Enter name" });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: "Enter email" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Enter password" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password length must me at least 6 characters",
      });
    }

    const existUser = await Frontend_Users.findOne({ email });
    if (existUser) {
      return res
        .status(409)
        .json({ success: false, message: "User is already register" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await Frontend_Users.create({
      name,
      email,
      password: hashPassword,
    });

    const payload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
    const token = generatedToken(payload);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("register user :", error);

    res.status(500).json({ success: false, message: "Server error" });
  }
};

// login

export const loginFrontendUser = async (req, res) => {
  try {
    if (req.body == null) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty",
      });
    }

    // CASE 2 — req.body exists but is empty {}
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No user data is provided",
      });
    }
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    const existingUser = await Frontend_Users.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "Email does not exists." });
    }
    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!comparePassword) {
      return res
        .status(401)
        .json({ success: false, message: "Password does not match." });
    }
    const payload = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    };

    const token = generatedToken(payload);

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      token: token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
