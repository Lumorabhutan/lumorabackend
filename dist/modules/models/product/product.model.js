"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db")); // adjust path if needed
class Product extends sequelize_1.Model {
    id;
    category;
    product_name;
    original_price;
    discount_percent;
    final_price;
    description;
    images;
    createdAt;
    updatedAt;
}
exports.Product = Product;
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    product_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    original_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
    },
    discount_percent: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: { min: 0, max: 100 },
    },
    final_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    images: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: [],
    },
}, {
    sequelize: db_1.default,
    tableName: "products",
    timestamps: false,
    underscored: false, // ← Add this line
});
exports.default = Product;
//# sourceMappingURL=product.model.js.map