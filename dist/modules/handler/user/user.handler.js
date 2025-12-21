"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../../repository/user/user.repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../../../middleware/token");
const error_1 = require("../../../middleware/error");
const userRepo = new user_repository_1.default();
class UserService {
    // Create user with permissions
    async createUser(payload) {
        const { name, email, password, role, status, permissions, permissionsList, identificationNo } = payload;
        const existingUser = await userRepo.findByEmail(email);
        if (existingUser)
            throw new Error("User already exists");
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        return userRepo.create({
            name,
            email,
            identificationNo,
            password: hashedPassword,
            role: role || "user",
            status: status || "active",
            permissions,
            permissionsList,
        });
    }
    // Update user with permissions
    async updateUser(id, data) {
        if (!id)
            throw new Error("Invalid user ID");
        const updateData = { ...data };
        const updatedUser = await userRepo.update(id, updateData);
        if (!updatedUser)
            throw new Error("User not found");
        return updatedUser;
    }
    // Other existing methods
    async getAllUsers() {
        return userRepo.findAll();
    }
    async getUserById(id) {
        if (!id)
            throw new Error("Invalid user ID");
        return userRepo.findById(id);
    }
    async deleteUser(id) {
        if (!id)
            throw new Error("Invalid user ID");
        return userRepo.delete(id);
    }
    async loginUser(email, password) {
        const user = await userRepo.findByEmail(email);
        if (!user || !(await bcrypt_1.default.compare(password, user?.dataValues.password)))
            throw new Error("Invalid credentials");
        if (user.dataValues.status.toLocaleLowerCase() !== "active")
            throw new Error("User account is not active");
        const { accessToken, refreshToken } = await (0, token_1.ACCESS_TOKEN)({
            id: user.dataValues.id,
            name: user.dataValues.name,
            email: user.dataValues.email,
            role: user.dataValues.role,
            status: user.dataValues.status,
            permissions: user.dataValues.permissions,
            permissionsList: user.dataValues.permissionsList,
        });
        return { accessToken, refreshToken };
    }
    async findUserByEmail(email) {
        return userRepo.findByEmail(email);
    }
    async updateUserPassword(email, currentPassword, newPassword, identificationNo) {
        try {
            const user = await userRepo.findByEmail(email);
            if (!user) {
                throw new error_1.AppError('User not found', 404);
            }
            if (identificationNo && user.dataValues.identificationNo !== identificationNo) {
                throw new error_1.AppError('Identification number does not match', 400);
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            return await userRepo.updatePasswordWithHash(user, hashedPassword);
        }
        catch (error) {
            throw new Error(error.message || "Failed to update password");
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=user.handler.js.map