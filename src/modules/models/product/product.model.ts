import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import sequelize from "../../../config/db"; // adjust path if needed

interface ProductAttributes {
  id: number;
  category: string;
  product_name: string;
  original_price: number;
  discount_percent: number;
  final_price: number;
  description?: string | null;
  images: (string | null)[]; // allow nulls
}

interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    "id" 
  > {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public category!: string;
  public product_name!: string;
  public original_price!: number;
  public discount_percent!: number;
  public final_price!: number;
  public description?: string | null;
  public images!: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    original_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    discount_percent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    final_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: false,
  
  }
);

export default Product;