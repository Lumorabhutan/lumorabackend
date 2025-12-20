"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db")); // adjust path
const OrderItem_model_1 = require("./OrderItem.model");
class Order extends sequelize_1.Model {
    id;
    name;
    email;
    phone;
    subtotal;
    total;
    status;
    createdAt;
    updatedAt;
    items;
}
exports.Order = Order;
Order.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    phone: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
    subtotal: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    total: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
}, {
    sequelize: db_1.default,
    tableName: "orders",
    timestamps: false,
});
// ✅ Define associations after both models are fully imported
Order.hasMany(OrderItem_model_1.OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem_model_1.OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
exports.default = Order;
//# sourceMappingURL=order.mode.js.map