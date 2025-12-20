import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import router from "./routes/auth.routes"; // adjust path if needed
import cookieParser from "cookie-parser";

dotenv.config();
import path from "path";
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

const app: Application = express();

// ✅ Dynamic CORS configuration for hotspot/local network testing
const corsOptions: CorsOptions = {

  origin: allowedOrigin, // frontend origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/v1", router);
app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "OK",
    message: "Backend is running successfully!",
    time: new Date().toISOString(),
  });
});

// ✅ Use 0.0.0.0 so it’s accessible from other laptops via hotspot IP
const PORT = process.env.PORT;

app.listen(Number(PORT),'0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


export default app;
