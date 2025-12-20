"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ========================
// CORS Configuration (FIXED)
// ========================
// List all allowed frontend origins
const allowedOrigins = [
    "https://travel-agent-olive.vercel.app", // Your current Vercel frontend
    "https://www.lumorabhutan.com", // Production domain
    "https://lumorabhutan.com", // Without www
    "http://localhost:3000", // Local development
    // Add preview URLs if needed, e.g.:
    // "https://travel-agent-olive-git-*.vercel.app"
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("Blocked by CORS:", origin); // Helpful for debugging
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // ✅ Now safe because we're not using "*"
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Routes
app.use("/api/v1", auth_routes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend is running successfully!",
        time: new Date().toISOString(),
    });
});
// ========================
// IMPORTANT FOR VERCEL
// ========================
// Remove app.listen() completely — Vercel doesn't use it in serverless functions
// Instead, export the app directly
// app.listen(...) ← DELETE THIS ENTIRE BLOCK
exports.default = app; // ← This is what Vercel needs
//# sourceMappingURL=server.js.map