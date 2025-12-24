import { google } from "googleapis";

export async function saveToGoogleSheet(data) {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // 🟢 HELPER FUNCTION: Converts objects/arrays to strings so Sheets can accept them
  const flatten = (val) => {
    if (Array.isArray(val)) {
      // If it's an array of strings, join them.
      // If it's an array of objects (like your experience), stringify it.
      return val
        .map((item) => (typeof item === "object" ? JSON.stringify(item) : item))
        .join("\n\n");
    }
    if (typeof val === "object" && val !== null) {
      return JSON.stringify(val);
    }
    return val || "";
  };

  // ✅ Flatten every field before putting it in the values array
  const values = [
    flatten(data.name),
    flatten(data.email),
    flatten(data.phone),
    flatten(data.skills),
    flatten(data.experience), // 🟢 This was causing your error
    flatten(data.education), // 🟢 This would have caused the next error
    new Date().toLocaleString(),
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:G", // 🟢 Updated range for 7 columns
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  } catch (err) {
    console.error("Google Sheets Error:", err);
    throw new Error("Failed to save to spreadsheet");
  }
}
