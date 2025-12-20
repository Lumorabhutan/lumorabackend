import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/db";

// Define attributes
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  permissions?: Record<string, string[]>; // object like { user: ["create","list"] }
  permissionsList?: string[];            // flat array ["user:create", "booking:list"]
  createdAt?: Date;
  updatedAt?: Date;
  identificationNo?: string;
}

// For creation, id is optional
export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "status" | "permissions" | "permissionsList"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  role!: string;
  status!: string;
  permissions?: Record<string, string[]>;
  permissionsList?: string[];
  identificationNo?: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } },
    identificationNo: { type: DataTypes.STRING(50), allowNull: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "active" },
    permissions: { type: DataTypes.JSON, allowNull: true },
    permissionsList: { type: DataTypes.JSON, allowNull: true },
  },
  {
    sequelize,
    tableName: "Users",
    modelName: "User",
    timestamps: false,
    underscored: true,  // ← Add this line
  }
);

export default User;
