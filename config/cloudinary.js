// import dotenv from "dotenv";
// import fs from "fs";
// // Load .env first
// if (fs.existsSync(".env")) {
//   dotenv.config({ path: ".env" });
// }

// // Load .env.production next (overrides any duplicate keys)
// if (fs.existsSync(".env.production")) {
//   dotenv.config({ path: ".env.production" });
// }
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API key:", process.env.CLOUDINARY_API_KEY);
// console.log("API secret:", process.env.CLOUDINARY_API_SECRET);

export default cloudinary;
