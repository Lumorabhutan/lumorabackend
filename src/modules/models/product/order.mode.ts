import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/db"; // adjust path
import { OrderItem } from "./OrderItem.model";

interface OrderAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  subtotal: number;
  total: number;
  status?: string;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public subtotal!: number;
  public total!: number;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly items?: OrderItem[];
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(50), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: true },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: false,
    underscored: false,  // This makes all models use snake_case
  }
);

// ✅ Define associations after both models are fully imported
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

export default Order;
