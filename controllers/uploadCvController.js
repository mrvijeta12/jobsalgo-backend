import { parseCvWithAI } from "../utilities/aiCvParser.js";
import { saveToGoogleSheet } from "../config/googleSheets.js";

export async function uploadCv(req, res) {
  // console.log("✅ /upload-cv API HIT");
  // console.log("File:", req.file);
  // res.json({ message: "API reached" });
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1️⃣ & 2️⃣ Call the utility function (genAI is used inside THIS function)
    const structured = await parseCvWithAI(req.file.buffer);

    // 3️⃣ Save to Google Sheets
    await saveToGoogleSheet(structured);

    return res.status(200).json({
      success: true,
      data: structured,
      message: "CV saved successfully",
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to saved CV" || error.message });
  }
}
