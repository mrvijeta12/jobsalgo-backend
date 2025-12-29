import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    job_title: {
      type: String,
      required: true,
      trim: true,
    },

    job_type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Remote", "Contract"],
      required: true,
    },
    category: {
      type: String,
      enum: ["IT", "HR", "Marketing", "Sales"],
      required: true,
    },
    location: {
      type: String,
      trim: true,
      required: function () {
        return this.work_mode === "Onsite" || this.work_mode === "Hybrid";
      },
    },
    minSalary: {
      type: Number,
      min: 0,
      required: true,
    },
    maxSalary: {
      type: Number,
      min: 0,
      required: true,
    },
    experience: {
      type: String,
      enum: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
      required: true,
    },

    number_of_openings: {
      type: Number,
      min: 1,
      required: true,
    },
    application_deadline: {
      type: Date,
      required: true,
    },
    posted_date: {
      type: Date,
      default: Date.now,
    },
    job_description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      trim: true,
      required: true,
    },

    education: {
      type: String,
      trim: true,
      required: true,
    },
    work_mode: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid"],
      required: true,
    },
    employment_type: {
      type: String,
      enum: ["Permanent", "Contract", "Freelance"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    job_level: {
      type: String,
      enum: ["Junior", "Mid-Level", "Senior", "Lead"],
      required: true,
    },
    application_link: {
      type: String,
      trim: true,
    },
    jobStatus: {
      type: String,
      enum: ["Active", "Inactive", "Draft"],
      default: "Draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employers",
    },
  },
  { timestamps: true }
);

const Jobs = mongoose.model("Jobs", jobSchema);
export default Jobs;
