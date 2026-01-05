import mongoose from "mongoose";
import Jobs from "../modals/jobsModal.js";

export const addJob = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty",
      });
    }

    const {
      job_title,
      job_type,
      category,
      location,
      minSalary,
      maxSalary,
      experience,
      number_of_openings,
      application_deadline,
      job_description,
      skills,
      education,
      work_mode,
      employment_type,
      email,
      job_level,
    } = req.body;

    const employerId = req.query.id?.trim();
    if (!employerId) {
      return res
        .status(400)
        .json({ success: false, message: "Employer ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(employerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Employer ID format." });
    }

    // Required snake_case fields (matching your schema 100%)

    const requiredFields = {
      job_title: "Job title",
      job_type: "Job type",
      category: "Category",
      minSalary: "Min salary",
      maxSalary: "Max salary",
      experience: "Experience",
      number_of_openings: "Number of openings",
      application_deadline: "Application deadline",
      job_description: "Job description",
      skills: "Skills",
      education: "Education",
      work_mode: "Work mode",
      employment_type: "Employment type",
      email: "Email",
      job_level: "Job level",
    };

    for (const key in requiredFields) {
      if (!req.body[key]) {
        return res.status(400).json({
          success: false,
          message: `${requiredFields[key]} is required.`,
        });
      }
    }
    if (req.body.work_mode === "Onsite" || req.body.work_mode === "Hybrid") {
      if (!req.body.location) {
        return res.status(400).json({
          success: false,
          message: "Location is required for Onsite or Hybrid jobs.",
        });
      }
    }
    const minSalaryNum = Number(minSalary);
    const maxSalaryNum = Number(maxSalary);

    if (isNaN(minSalaryNum) || isNaN(maxSalaryNum)) {
      return res.status(400).json({
        success: false,
        message: "Salary must be valid number.",
      });
    }
    if (minSalaryNum > maxSalaryNum) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum salary must be greater than or equal to minimum salary.",
      });
    }

    // Create job
    const newJob = await Jobs.create({
      ...req.body,
      minSalary: minSalaryNum,
      maxSalary: maxSalaryNum,
      createdBy: employerId,
    });

    // console.log(newJob);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    console.error("Error adding job:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Jobs.find()
      .populate("createdBy")
      .sort({ createdAt: -1 });
    // console.log(jobs);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.log("Error fetching jobs:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//update jobs

export const updateJobs = async (req, res) => {
  try {
    const jobId = req.query.id?.trim();

    // Validate ID
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format.",
      });
    }

    // Check if job exists
    const jobExists = await Jobs.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: `Job not found with ID: ${jobId}`,
      });
    }

    // req.body is null or undefined
    if (req.body == null) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty",
      });
    }

    const updates = req.body;

    //  req.body exists BUT is empty {}
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    //  Required fields — only validate IF the user is updating them
    const requiredFields = {
      job_title: "Job title",
      job_type: "Job type",
      category: "Category",
      minSalary: "Min Salary",
      maxSalary: "Max Salary",
      experience: "Experience",
      number_of_openings: "Number of openings",
      application_deadline: "Application deadline",
      job_description: "Job description",
      skills: "Skills",
      education: "Education",
      work_mode: "Work mode",
      employment_type: "Employment type",
      email: "Email",
      job_level: "Job level",
    };

    for (const field in updates) {
      if (requiredFields[field]) {
        const val = updates[field];

        // Check empty values
        if (
          val === "" ||
          val === null ||
          (typeof val === "string" && val.trim() === "")
        ) {
          return res.status(400).json({
            success: false,
            message: `${requiredFields[field]} cannot be empty.`,
          });
        }
      }
    }

    if (updates.minSalary !== undefined || updates.maxSalary !== undefined) {
      const minSalaryNum = Number(updates.minSalary ?? jobExists.minSalary);
      const maxSalaryNum = Number(updates.maxSalary ?? jobExists.maxSalary);

      if (isNaN(minSalaryNum) || isNaN(maxSalaryNum)) {
        return res.status(400).json({
          success: false,
          message: "Salary must be a valid number.",
        });
      }
      if (minSalaryNum > maxSalaryNum) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum salary must be greater than or equal to minimum salary.",
        });
      }
      updates.minSalary = minSalaryNum;
      updates.maxSalary = maxSalaryNum;
    }

    //  Conditional validation for location
    const newWorkMode = updates.work_mode || jobExists.work_mode;

    if (newWorkMode === "Onsite" || newWorkMode === "Hybrid") {
      if (!updates.location && !jobExists.location) {
        return res.status(400).json({
          success: false,
          message: "Location is required for Onsite or Hybrid jobs.",
        });
      }
    }

    //  Update job
    const updatedJob = await Jobs.findByIdAndUpdate(jobId, updates, {
      new: true,
      runValidators: true,
    });
    // console.log(updatedJob);

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// get job by id

export const getJob = async (req, res) => {
  try {
    const id = req.query.id?.trim();
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Job ID format." });
    }
    const jobExist = await Jobs.findById(id).populate("createdBy");
    if (!jobExist) {
      return res
        .status(404)
        .json({ success: false, message: `Job not found with ID: ${id}` });
    }
    return res.status(200).json({
      success: true,
      message: "Job  fetched successfully",
      job: jobExist,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// delete job

export const deleteJob = async (req, res) => {
  try {
    const id = req.query.id?.trim();

    // Validate id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format.",
      });
    }

    // Check if job exists
    const jobExists = await Jobs.findById(id);
    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: `Job not found with ID: ${id}`,
      });
    }

    // Delete job
    const deletedJob = await Jobs.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
      deletedJob: deletedJob,
    });
  } catch (error) {
    console.error("Error deleting job:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
