"use strict";
// // 
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const databaseUrl = process.env.DATABASE_URL
// //  || 
//   // 'postgresql://postgres:RGUlXcYyOoBSguVVBMRckIQMxxfDdKML@postgres.railway.internal:5432/railway';
// // Option 1: Use connection string (simpler)
// const sequelize = new Sequelize(databaseUrl, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false 
//     }
//   },
//   logging: false
// });
// export default sequelize;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL ||
    'postgresql://postgres:RGUlXcYyOoBSguVVBMRckIQMxxfDdKML@postgres.railway.internal:5432/railway';
if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
}
const isProduction = process.env.NODE_ENV === 'production';
const sequelize = new sequelize_1.Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: !isProduction
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
        : {}, // ❌ NO SSL locally
    logging: false,
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map