// // utils/getPdfParse.js
// import { createRequire } from "module";

// export function getPdfParse() {
//   const require = createRequire(import.meta.url);
//   const pdfParseModule = require("pdf-parse");

//   // Some Node versions wrap the module differently
//   if (typeof pdfParseModule === "function") return pdfParseModule;
//   if (pdfParseModule && typeof pdfParseModule.default === "function")
//     return pdfParseModule.default;

//   throw new Error("Cannot load pdf-parse function");
// }
