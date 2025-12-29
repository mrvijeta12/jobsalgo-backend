import dotenv from "dotenv";
import fs from "fs";
// Load .env first
if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
}

// Load .env.production next
if (fs.existsSync(".env.production")) {
  dotenv.config({ path: ".env.production" });
}
