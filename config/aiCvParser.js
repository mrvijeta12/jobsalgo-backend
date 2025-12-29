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
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🟢 genAI is defined here locally in this file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log(genAI);

export async function parseCvWithAI(fileBuffer) {
  // Use the 2025 stable model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const pdfPart = {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType: "application/pdf",
    },
  };

  const prompt =
    "Extract name, email, phone, skills (array), experience, and education from this CV. Return ONLY valid JSON.";

  const result = await model.generateContent([prompt, pdfPart]);
  const text = result.response.text();

  // Strip any markdown code blocks the AI might include
  const cleanJson = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleanJson);
}
