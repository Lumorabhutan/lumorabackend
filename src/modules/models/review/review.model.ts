import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/db";

export class Review extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public rating!: number;
  public comment!: string;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
       defaultValue: false
    }
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "Reviews",
    timestamps: false,
  }
);

export default Review;
