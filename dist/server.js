"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // adjust path if needed
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
const app = (0, express_1.default)();
// ✅ Dynamic CORS configuration for hotspot/local network testing
const corsOptions = {
    origin: allowedOrigin, // frontend origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use("/api/v1", auth_routes_1.default);
app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "OK",
        message: "Backend is running successfully!",
        time: new Date().toISOString(),
    });
});
// ✅ Use 0.0.0.0 so it’s accessible from other laptops via hotspot IP
const PORT = process.env.PORT || 3001;
app.listen(Number(PORT), () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map