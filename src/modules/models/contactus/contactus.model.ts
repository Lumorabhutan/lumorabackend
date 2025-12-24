import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/db";

class Contact extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public subject!: string;
  public message!: string;
   readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

Contact.init(
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
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Contact",
    tableName: "Contacts",
    timestamps: false,
  }
);

export default Contact;
