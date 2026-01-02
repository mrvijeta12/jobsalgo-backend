import mongoose from "mongoose";
// import Frontend_Jobs from "../../modals/frontendJobModal.js";
// import Frontend_Users from "../../modals/frontendUsersModal.js";
import Jobs from "../../modals/jobsModal.js";

//! add jobs (post a job page)
// export const addFrontendJob = async (req, res) => {
//   try {
//     // Request body empty check
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body cannot be empty",
//       });
//     }

//     const userId = req.query.id?.trim();
//     console.log(userId);

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "Employer ID is required",
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Employer ID format",
//       });
//     }

//     const user = await Frontend_Users.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Required fields list
//     const requiredFields = [
//       "company_name",
//       "job_title",
//       "category",
//       "work_mode",
//       "experience",
//       "job_level",
//       "salary_range",
//       "openings",
//       "job_type",
//       "employment_type",
//       "education",
//       "posted_date",
//       "application_deadline",
//       "job_description",
//       "skills",
//       "company_email",
//     ];

//     // Validate required fields
//     for (const field of requiredFields) {
//       if (!req.body[field] || String(req.body[field]).trim() === "") {
//         return res.status(400).json({
//           success: false,
//           message: `${field} is required`,
//         });
//       }
//     }

//     // Validate location if work_mode = onsite/hybrid
//     if (req.body.work_mode === "Onsite" || req.body.work_mode === "Hybrid") {
//       if (!req.body.location || req.body.location.trim() === "") {
//         return res.status(400).json({
//           success: false,
//           message: "Location is required for Onsite or Hybrid",
//         });
//       }
//     }

//     // Trim string fields
//     const cleanedData = {};
//     for (const key in req.body) {
//       cleanedData[key] =
//         typeof req.body[key] === "string"
//           ? req.body[key].trim()
//           : req.body[key];
//     }

//     cleanedData.createdBy = userId;

//     // Create job
//     const newJob = await Frontend_Jobs.create(cleanedData);

//     return res.status(201).json({
//       success: true,
//       message: "Job created successfully",
//       data: newJob,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

//! get all jobs from jobs table (all job page / job listing page )
const ALLOWED_FILTERS = [
  "job_title",
  "job_type",
  "category",
  "location",
  "minSalary",
  "maxSalary",
  "experience",
  "posted_date",
  "work_mode",
];

const cleanFilters = (query) => {
  const filters = {};
  for (const [key, value] of Object.entries(query)) {
    if (
      ALLOWED_FILTERS.includes(key) &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      filters[key] = value;
    }
  }
  return filters;
};
const buildMongoQuery = (filters) => {
  const query = {};

  if (filters.job_title) {
    query.job_title = { $regex: filters.job_title, $options: "i" };
  }

  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.experience) {
    query.experience = filters.experience;
  }

  if (filters.location) {
    query.location = filters.location;
  }

  if (filters.job_type) {
    query.job_type = { $in: [].concat(filters.job_type) };
  }

  if (filters.work_mode) {
    query.work_mode = { $in: [].concat(filters.work_mode) };
  }

  if (filters.minSalary !== undefined || filters.maxSalary !== undefined) {
    query.$and = [];

    if (filters.minSalary !== undefined) {
      query.$and.push({
        maxSalary: { $gte: Number(filters.minSalary) },
      });
    }

    if (filters.maxSalary !== undefined) {
      query.$and.push({
        minSalary: { $lte: Number(filters.maxSalary) },
      });
    }
  }

  if (filters.posted_date) {
    const now = new Date();
    let startDate;

    switch (filters.posted_date) {
      case "today":
        startDate = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        );
        break;

      case "3days":
        startDate = new Date();
        startDate.setUTCDate(startDate.getUTCDate() - 3);
        break;

      case "7days":
        startDate = new Date();
        startDate.setUTCDate(startDate.getUTCDate() - 7);
        break;

      case "30days":
        startDate = new Date();
        startDate.setUTCDate(startDate.getUTCDate() - 30);
        break;
    }

    query.posted_date = { $gte: startDate };
  }

  return query;
};

export const getPublicJobs = async (req, res) => {
  const result = cleanFilters(req.query);
  const mongoQuery = buildMongoQuery(result);
  // console.log(mongoQuery);
  let sortQuery = { createdAt: -1 }; // default

  switch (req.query.sort) {
    case "salary_low":
      sortQuery = { minSalary: 1 };
      break;
    case "salary_high":
      sortQuery = { maxSalary: -1 };
      break;
    case "recent":
      sortQuery = { posted_date: -1 };
      break;
  }

  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const jobs = await Jobs.find(mongoQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

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

// get job by id

export const getPublicJobById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

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
      message: "Job fetched successfully",
      job: jobExist,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
