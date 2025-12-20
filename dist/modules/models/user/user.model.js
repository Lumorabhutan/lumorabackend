"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
class User extends sequelize_1.Model {
    id;
    name;
    email;
    password;
    role;
    status;
    permissions;
    permissionsList;
    identificationNo;
    createdAt;
    updatedAt;
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } },
    identificationNo: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: "user" },
    status: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: "active" },
    permissions: { type: sequelize_1.DataTypes.JSON, allowNull: true },
    permissionsList: { type: sequelize_1.DataTypes.JSON, allowNull: true },
}, {
    sequelize: db_1.default,
    tableName: "Users",
    modelName: "User",
    timestamps: false,
    underscored: true, // ← Add this line
});
exports.default = User;
//# sourceMappingURL=user.model.js.map