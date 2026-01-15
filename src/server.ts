import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import router from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app: Application = express();

// ========================
// CORS Configuration (FIXED - Secure Setup)
// ========================

const allowedOrigins = [
  "https://travel-agent-olive.vercel.app",  // Your Vercel frontend
  "https://www.lumorabhutan.com",           // Production domain
  "https://lumorabhutan.com",               // Without www
  "*",                  // Local development
  // Add preview URLs if needed, e.g.:
  // "https://travel-agent-olive-git-main-yourusername.vercel.app"
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, mobile apps, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin); // Log for debugging
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Safe with specific origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.set("trust proxy", 1); // Trust first proxy (needed for secure cookies behind proxies)
// Routes
app.use("/api/v1", router);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running successfully!",
    time: new Date().toISOString(),
  });
});

// ========================
// FOR RAILWAY (or similar hosts)
// ========================

const PORT = process.env.PORT

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Keep this for Vercel compatibility (optional)
export default app;