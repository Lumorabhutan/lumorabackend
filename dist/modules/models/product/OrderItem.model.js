"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db")); // adjust path
class OrderItem extends sequelize_1.Model {
    id;
    orderId;
    productId;
    name;
    quantity;
    price;
    createdAt;
    updatedAt;
}
exports.OrderItem = OrderItem;
OrderItem.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    productId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
    sequelize: db_1.default,
    tableName: "order_items",
    timestamps: false,
    underscored: false, // This makes all models use snake_case
});
exports.default = OrderItem;
//# sourceMappingURL=OrderItem.model.js.map