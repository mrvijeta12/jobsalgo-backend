import "./config/env.js";
import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import cors from "cors";
import connection from "./connection/db.js";

connection();
const PORT = process.env.PORT || 8000;

const app = express();
const allowedOrigins = [
  "https://jobsalgo.com",
  "https://www.jobsalgo.com",
  // "http://localhost:3000",
  // "http://localhost:5173",
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
app.use(express.json({ limit: "50mb" })); // Increased for file uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//routes
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

app.get("/", (req, res) => {
  res.send("<h1> Hello World </h1>");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
