import { parseCvWithAI } from "../config/aiCvParser.js";
import { saveToGoogleSheet } from "../config/googleSheets.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export async function uploadCv(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //  Upload CV to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "cvs",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // // cloudnary cv link
    const cvUrl = cloudinaryResult.secure_url;

    //  parse cv with Ai

    const structured = await parseCvWithAI(req.file.buffer);

    //  Save to Google Sheets
    await saveToGoogleSheet({ ...structured, cvUrl });
    // await saveToGoogleSheet(structured);

    return res.status(200).json({
      success: true,
      message: "CV saved successfully",
      data: structured,
      cvUrl,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to saved CV" || error.message });
  }
}
