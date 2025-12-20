"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
class Trip extends sequelize_1.Model {
}
Trip.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    subtitle: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
    },
    originalPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    discountPercent: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    finalPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    durationDays: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    ages: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    isTrending: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isFirsttime: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    images: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: [],
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    sequelize: db_1.default,
    tableName: "Trips",
    modelName: "Trips",
    timestamps: false,
    underscored: false, // ← Add this line
});
exports.default = Trip;
//# sourceMappingURL=trips.model.js.map