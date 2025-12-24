import express from "express";

//! Public section controllers
import {
  loginFrontendUser,
  registerFrontendUser,
} from "../Public/controllers/frontendUserAuthController.js";
import {
  addFrontendJob,
  getPublicJobs,
  getPublicJobById,
} from "../Public/controllers/frontendJobController.js";

//! MAILER
import { sendMail } from "../Public/controllers/mailController.js";

//! MIDDLEWARE
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

//! AUTH
//register
router.post("/register", registerFrontendUser);

// login
router.post("/login", loginFrontendUser);

//! Jobs
// add job
router.post("/addjob", verifyToken, addFrontendJob);

// get all jobs
router.get("/jobs", getPublicJobs);
// get  job by id
router.get("/jobs/:id", getPublicJobById);

//! MAILER
router.post("send-mail", sendMail);

//! End of  FRONTEND SECTION

export default router;
