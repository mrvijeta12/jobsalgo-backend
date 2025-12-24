import mongoose from "mongoose";

const FrontendJobSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      trim: true,
      required: true,
    },

    job_title: {
      type: String,
      trim: true,
      required: true,
    },

    category: {
      type: String,
      trim: true,
      required: true,
      enum: ["IT", "Sales", "HR"],
    },

    work_mode: {
      type: String,
      trim: true,
      required: true,
      enum: ["Onsite", "Remote", "Hybrid"],
    },

    location: {
      type: String,
      trim: true,
      required: function () {
        return this.work_mode === "Onsite" || this.work_mode === "Hybrid";
      },
    },

    experience: {
      type: String,
      trim: true,
      required: true,
      enum: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
    },

    job_level: {
      type: String,
      trim: true,
      required: true,
      enum: ["Junior", "Mid-Level", "Senior", "Lead"],
    },

    salary_range: {
      type: String,
      trim: true,
      required: true,
    },

    openings: {
      type: Number,
      required: true,
      default: 1,
    },

    job_type: {
      type: String,
      trim: true,
      required: true,
      enum: ["Part Time", "Full Time"],
      default: "Full Time",
    },

    employment_type: {
      type: String,
      trim: true,
      required: true,
      enum: ["Permanent", "Contract", "Freelance"],
    },

    education: {
      type: String,
      trim: true,
      required: true,
    },

    posted_date: {
      type: Date,
      required: true,
    },

    application_deadline: {
      type: Date,
      required: true,
    },

    job_description: {
      type: String,
      trim: true,
      required: true,
    },

    skills: {
      type: [String],
      trim: true,
      required: true,
    },

    company_email: {
      type: String,
      trim: true,
      required: true,
    },

    company_website: {
      type: String,
      trim: true,
    },

    company_description: {
      type: String,
      trim: true,
    },

    facebook: {
      type: String,
      trim: true,
    },

    twitter: {
      type: String,
      trim: true,
    },

    linkedin: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Frontend_Users",
    },
  },
  { timestamps: true }
);

const Frontend_Jobs =
  mongoose.models.Frontend_Jobs ||
  mongoose.model("Frontend_Jobs", FrontendJobSchema);
export default Frontend_Jobs;
