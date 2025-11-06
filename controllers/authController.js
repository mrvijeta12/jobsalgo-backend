import User from "../modals/userModal.js";
import bcrypt from "bcryptjs";
import { generatedToken, verifyToken } from "../middleware/jwt.js";
import jwt from "jsonwebtoken";

// register

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.json({ message: "Name is required" });
    }
    if (!email) {
      return res.json({ message: "Email is required" });
    }
    if (!password) {
      return res.json({ message: "Password is required" });
    }
    if (password.length < 6) {
      return res.json({
        message: "Password length must me at least 6 characters",
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.json({ message: "User is already register" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });
    res.status(201).json({
      message: "User register successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(501).json({ message: "Server error" });
  }
};

// login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "Email does not exists." });
    }
    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!comparePassword) {
      return res.status(400).json({ message: "Passoerd does not match." });
    }
    const payload = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    };

    const token = generatedToken(payload);

    return res.status(200).json({
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
    return res.status(500).json({ message: "Server error." });
  }
};

//verify token

export const verifyTokenController = async (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    user: req.loggedInUser,
  });
};
