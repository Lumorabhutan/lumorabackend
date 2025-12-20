// models/Blog.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/db";
import BlogItem from "./BlogItem";

interface BlogAttributes {
  id: number;
  category?: string | null;
  is_published: boolean;
  published_at?: string | null; // DATEONLY → stored as string 'YYYY-MM-DD'
}

export interface BlogCreationAttributes
  extends Optional<BlogAttributes, "id" | "category" | "published_at"> {}

class Blog extends Model<BlogAttributes, BlogCreationAttributes>
  implements BlogAttributes {
  public id!: number;
  public category!: string | null;
  public is_published!: boolean;
  public published_at!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual for easy access to items
  public items?: BlogItem[];
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    published_at: {
      type: DataTypes.DATEONLY, // stores as '2025-11-20'
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "blogs",
    timestamps: false,
    
    indexes: [
      { fields: ["published_at"] },
      { fields: ["is_published"] },
    ],
  }
);

// Associations
Blog.hasMany(BlogItem, {
  foreignKey: "blog_id",
  as: "items",
  onDelete: "CASCADE",
});
BlogItem.belongsTo(Blog, { foreignKey: "blog_id" });

export default Blog;