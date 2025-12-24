import express from "express";

import {
  registerUser,
  loginUser,
  verifyTokenController,
} from "../controllers/authController.js";
import {
  addEmployer,
  getAllEmployers,
  updateEmployer,
  getEmployer,
  deleteEmployer,
  getEmployersByUser,
} from "../controllers/employerController.js";
import {
  addJob,
  getAllJobs,
  updateJobs,
  getJob,
  deleteJob,
} from "../controllers/jobsController.js";

//! MIDDLEWARE
import { verifyToken } from "../middleware/jwt.js";
import { uploadCv } from "../controllers/uploadCvController.js";
import upload from "../middleware/uploadCV.js";

const router = express.Router();

//! AUTH
//register
router.post("/register", registerUser);

// login
router.post("/login", loginUser);

//! verify token
router.get("/verifyToken", verifyToken, verifyTokenController);

//! EMPLOYERS
// add employer
router.post("/addEmployer", verifyToken, addEmployer);

// get employer
router.get("/getEmployer", verifyToken, getEmployer);

// get all employers
router.get("/getAllEmployers", verifyToken, getAllEmployers);

// update employer
router.put("/updateEmployer", verifyToken, updateEmployer);

// delete employer
router.delete("/deleteEmployer", verifyToken, deleteEmployer);

// get employer by user
router.get("/employers/created-by", verifyToken, getEmployersByUser);

//! JOBS

// add job
router.post("/addjob", verifyToken, addJob);

// get all jobs
router.get("/getalljobs", verifyToken, getAllJobs);

// update job
router.put("/updatejob", verifyToken, updateJobs);

// get job by id
router.get("/getjob", verifyToken, getJob);

// delete job
router.delete("/deletejob", verifyToken, deleteJob);

//! CV
router.post("/upload-cv", upload.single("cv"), uploadCv);

export default router;
