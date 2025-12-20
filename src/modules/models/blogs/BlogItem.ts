// models/BlogItem.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/db";

interface BlogItemAttributes {
  id: number;
  blog_id: number;
  title?: string | null;
  link?: string | null;
  content?: string | null;
  subcontents?: string | null; // stored as JSON string
  images?: string | null;      // stored as JSON string or handle via separate table
}

export interface BlogItemCreationAttributes
  extends Optional<BlogItemAttributes, "id" | "title" | "link" | "content" | "subcontents" | "images"> {}

class BlogItem
  extends Model<BlogItemAttributes, BlogItemCreationAttributes>
  implements BlogItemAttributes
{
  public id!: number;
  public blog_id!: number;
  public title!: string | null;
  public link!: string | null;
  public content!: string | null;
  public subcontents!: string | null;
  public images!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Getter to auto-parse JSON fields
  public get subcontentsArray(): string[] {
    try {
      return this.subcontents ? JSON.parse(this.subcontents) : [];
    } catch {
      return [];
    }
  }

  public get imagesArray(): any[] {
    try {
      return this.images ? JSON.parse(this.images) : [];
    } catch {
      return [];
    }
  }
}

BlogItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subcontents: {
      type: DataTypes.JSON, // or DataTypes.TEXT if your DB doesn't support JSON
      allowNull: true,
      defaultValue: "[]",
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: "[]",
    },
  },
  {
    sequelize,
    tableName: "blog_items",
    timestamps: false,
  }
);

export default BlogItem;