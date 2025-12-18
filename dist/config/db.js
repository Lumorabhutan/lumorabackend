"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map