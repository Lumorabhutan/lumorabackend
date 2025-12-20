import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/db";
// import User from "./user.model"; // Uncomment when User model exists

interface BookingAttributes {
    id: number;
    bookingDate: Date;
    travelStartDate: Date;
    travelEndDate: Date;
    adultNum: number;
    childNum: number;
    numTravelers: number;
    country: string;
    totalAmount: number;
    status: string;
    email: string;
    name: string;
    paymentStatus: string;
    travelType: string;
    mobileNo: string;
    specialRequest?: string;
    remarks?: string;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, "id"> { }

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    id!: number;
    bookingDate!: Date;
    travelStartDate!: Date;
    travelEndDate!: Date;
    country!: string;
    email!: string;
    name!: string;
    numTravelers!: number;
    totalAmount!: number;
    status!: string;
    adultNum!: number;
    childNum!: number;
    paymentStatus!: string;
    travelType!: string;
    mobileNo!: string;
    specialRequest?: string;
    remarks?: string;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bookingDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        travelStartDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        travelEndDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        adultNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        childNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        numTravelers: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "pending",
        },
        paymentStatus: {
            type: DataTypes.STRING,
            defaultValue: "pending",
        },
        travelType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobileNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        specialRequest: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "bookings",
        timestamps: false,
        underscored: false,  // ← Add this line
    }
);

// Relationships
// Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Booking;
