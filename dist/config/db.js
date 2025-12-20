"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// db.ts or sequelize.ts
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// db.ts or sequelize.ts
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_PUBLIC_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing. Make sure your Postgres plugin is in the same project and deployed.');
}
const sequelize = new sequelize_1.Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        underscored: true,
        timestamps: true,
    },
});
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Unable to connect to database:', error);
        return false;
    }
}
testConnection();
exports.default = sequelize;
//# sourceMappingURL=db.js.map