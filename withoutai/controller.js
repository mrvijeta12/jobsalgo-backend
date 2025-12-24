import mammoth from "mammoth";
import { extractData } from "../utilities/extractData.js";
import { saveToGoogleSheet } from "../config/googleSheets.js";
import pdf from "pdf-extraction";

export async function uploadCv(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let fullText = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdf(req.file.buffer); // pdf-extraction
      fullText = data.text || data.pages?.join("\n") || "";
    } else {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      fullText = result.value;
    }

    // Structured extraction (optional)
    const extracted = extractData(fullText);

    // Save if needed
    await saveToGoogleSheet({
      ...extracted,
      rawText: fullText,
    });

    // 👇 THIS is what you want to see
    return res.status(200).json({
      success: true,
      parsed: {
        rawText: fullText, // 👈 entire CV
        structured: extracted, // 👈 name/email/etc
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
