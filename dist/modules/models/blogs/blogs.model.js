"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Blog.ts
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
const BlogItem_1 = __importDefault(require("./BlogItem"));
class Blog extends sequelize_1.Model {
    id;
    category;
    is_published;
    published_at;
    createdAt;
    updatedAt;
    // Virtual for easy access to items
    items;
}
Blog.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    is_published: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    published_at: {
        type: sequelize_1.DataTypes.DATEONLY, // stores as '2025-11-20'
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    tableName: "blogs",
    timestamps: false,
    indexes: [
        { fields: ["published_at"] },
        { fields: ["is_published"] },
    ],
});
// Associations
Blog.hasMany(BlogItem_1.default, {
    foreignKey: "blog_id",
    as: "items",
    onDelete: "CASCADE",
});
BlogItem_1.default.belongsTo(Blog, { foreignKey: "blog_id" });
exports.default = Blog;
//# sourceMappingURL=blogs.model.js.map