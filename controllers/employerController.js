import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Employers from "../modals/employersModal.js";
import { json } from "stream/consumers";
import { log } from "console";

//! EMPLOYERS
// ADD EMPLOYER

export const addEmployer = async (req, res) => {
  try {
    // CASE 1 — req.body is null or undefined
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
        message: "No employer data is provided",
      });
    }

    const {
      company_logo,
      name,
      email,
      company_name,
      company_size,
      industry,
      company_location,
    } = req.body;

    const userId = req.loggedInUser?.id;

    // Required fields validation
    const requiredFields = {
      company_logo: "Company logo",
      name: "Name",
      email: "Email",
      company_name: "Company name",
      company_size: "Company size",
      industry: "Industry",
      company_location: "Company location",
    };

    for (const key in requiredFields) {
      if (!req.body[key]) {
        return res.status(400).json({
          success: false,
          message: `${requiredFields[key]} is required.`,
        });
      }
    }

    // Duplicate email check
    const existingEmployer = await Employers.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: "Employer(email) already exists.",
      });
    }

    // Create employer with ALL fields (required + optional)
    const newEmployer = await Employers.create({
      ...req.body, // adds optional fields automatically
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Employer created successfully",
      employer: newEmployer,
    });
  } catch (error) {
    console.error("Error adding employer:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET EMPLOYER BY ID

export const getEmployer = async (req, res) => {
  try {
    const id = req.query.id?.trim();
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Employer ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Employer ID format." });
    }
    const employerExist = await Employers.findById(id).populate("createdBy");
    if (!employerExist) {
      return res
        .status(404)
        .json({ success: false, message: `Employer not found with ID: ${id}` });
    }
    return res.status(200).json({
      success: true,
      message: "Employer  fetched successfully",
      employer: employerExist,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET ALL EMPLOYER

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employers.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Employers fetched successfully",
      employers,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE EMPLOYER

export const updateEmployer = async (req, res) => {
  try {
    const id = req.query.id?.trim();

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employer ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employer ID format.",
      });
    }

    // Check if employer exists
    const employerExist = await Employers.findById(id);
    if (!employerExist) {
      return res.status(404).json({
        success: false,
        message: `Employer not found with ID: ${id}`,
      });
    }

    // -------------------------------------------
    // 1️⃣ VALIDATE BODY — NO BODY AT ALL
    // -------------------------------------------
    if (req.body == null) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty",
      });
    }

    const updates = req.body;

    // -------------------------------------------
    // 2️⃣ BODY EXISTS BUT EMPTY {}
    // -------------------------------------------
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    // -------------------------------------------
    // 3️⃣ VALIDATE REQUIRED FIELDS (if provided)
    // -------------------------------------------

    const requiredFields = {
      company_logo: "Company logo",
      name: "Name",
      email: "Email",
      company_name: "Company Name",
      company_size: "Company Size",
      industry: "Industry",
      company_location: "Company Location",
    };

    for (const field in updates) {
      // Validate if required field provided but empty
      if (requiredFields[field] && updates[field]?.trim?.() === "") {
        return res.status(400).json({
          success: false,
          message: `${requiredFields[field]} cannot be empty.`,
        });
      }
    }

    // -------------------------------------------
    // 4️⃣ DUPLICATE EMAIL CHECK (ONLY IF EMAIL SENT)
    // -------------------------------------------
    if (updates.email && updates.email !== employerExist.email) {
      const existingEmail = await Employers.findOne({
        email: updates.email,
        _id: { $ne: id },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another employer.",
        });
      }
    }

    // -------------------------------------------
    // 5️⃣ PERFORM UPDATE
    // -------------------------------------------
    const updatedEmployer = await Employers.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Employer updated successfully.",
      employer: updatedEmployer,
    });
  } catch (error) {
    console.error("Error updating employer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE EMPLOYER

export const deleteEmployer = async (req, res) => {
  try {
    const id = req.query.id?.trim();

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employer ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employer ID format.",
      });
    }

    // Check if employer exists
    const employerExist = await Employers.findById(id);
    if (!employerExist) {
      return res.status(404).json({
        success: false,
        message: `Employer not found with ID: ${id}`,
      });
    }

    // Delete employer
    const deletedEmployer = await Employers.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Employer deleted successfully.",
      deletedEmployer: deletedEmployer,
    });
  } catch (error) {
    console.error("Error deleting employer:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// CREATED BY

export const getEmployersByUser = async (req, res) => {
  try {
    const id = req.query.id?.trim();
    // console.log(id);

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format.",
      });
    }

    const employers = await Employers.find({ createdBy: id });
    // console.log(employers);

    if (employers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No employer created for this user",
      });
    }
    return res.status(200).json({
      success: true,
      employers,
    });
  } catch (error) {
    console.error("Error fetching employer:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
