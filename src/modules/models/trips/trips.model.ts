import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/db";

// Attributes
export interface TripAttributes {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  originalPrice?: number;
  discountPercent?: number;
  finalPrice?: number;
  durationDays?: number;
  ages?: string;
  status?: string;
  isTrending?: boolean;
  category?: string;
  images?: string[];
  slug?:string;
  isFirsttime?:boolean
}

// For creation, id is optional
export interface TripCreationAttributes extends Optional<TripAttributes, "id"> {}

class Trip extends Model<TripAttributes, TripCreationAttributes> {}

Trip.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    originalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    discountPercent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    finalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ages: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isFirsttime:{
        type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
   images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    slug:{
       type: DataTypes.STRING(100),
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "Trips",
    modelName: "Trips",
    timestamps: false,
    underscored: false,  // ← Add this line
  }
);

export default Trip;
