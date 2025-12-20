"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
class Booking extends sequelize_1.Model {
    id;
    bookingDate;
    travelStartDate;
    travelEndDate;
    country;
    email;
    name;
    numTravelers;
    totalAmount;
    status;
    adultNum;
    childNum;
    paymentStatus;
    travelType;
    mobileNo;
    specialRequest;
    remarks;
    createdAt;
    updatedAt;
}
exports.Booking = Booking;
Booking.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bookingDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    travelStartDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    travelEndDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    adultNum: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    childNum: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    numTravelers: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "pending",
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "pending",
    },
    travelType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    mobileNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    specialRequest: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    remarks: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    tableName: "bookings",
    timestamps: false,
    underscored: false, // ← Add this line
});
// Relationships
// Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
exports.default = Booking;
//# sourceMappingURL=booking.model.js.map