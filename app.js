import dotenv from "dotenv";
import express from "express";
import connection from "./connection/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import cors from "cors";
import fs from "fs";

// Load .env first
if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
}

// Load .env.production next (overrides any duplicate keys)
if (fs.existsSync(".env.production")) {
  dotenv.config({ path: ".env.production" });
}
console.log(process.env);

const PORT = process.env.PORT || 8000;

//database
connection();
const app = express();
const allowedOrigins = [
  "https://jobsalgo.com",
  "https://www.jobsalgo.com",
  "http://localhost:3000", // Allow local React app
  "http://localhost:5173", // Allow Vite (if you use it)
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(` CORS Blocked: ${origin} is not in allowed list`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions)); // Fix for Express 5 crash

// Middleware
// app.use(express.json());
app.use(express.json({ limit: "50mb" })); // Increased for file uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 6. Logger (Moved up so it actually logs route hits)
app.use((req, res, next) => {
  console.log(`➡️  [${process.env.NODE_ENV}] ${req.method} ${req.originalUrl}`);
  next();
});

//routes
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("<h1> Hello World </h1>");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
