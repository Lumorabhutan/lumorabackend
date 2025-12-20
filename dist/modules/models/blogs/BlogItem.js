"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/BlogItem.ts
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
class BlogItem extends sequelize_1.Model {
    id;
    blog_id;
    title;
    link;
    content;
    subcontents;
    images;
    createdAt;
    updatedAt;
    // Getter to auto-parse JSON fields
    get subcontentsArray() {
        try {
            return this.subcontents ? JSON.parse(this.subcontents) : [];
        }
        catch {
            return [];
        }
    }
    get imagesArray() {
        try {
            return this.images ? JSON.parse(this.images) : [];
        }
        catch {
            return [];
        }
    }
}
BlogItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    blog_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    link: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    subcontents: {
        type: sequelize_1.DataTypes.JSON, // or DataTypes.TEXT if your DB doesn't support JSON
        allowNull: true,
        defaultValue: "[]",
    },
    images: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: "[]",
    },
}, {
    sequelize: db_1.default,
    tableName: "blog_items",
    timestamps: false,
});
exports.default = BlogItem;
//# sourceMappingURL=BlogItem.js.map