import UserRepository from "../../repository/user/user.repository";
import bcrypt from "bcrypt";
import { ACCESS_TOKEN } from "../../../middleware/token";
import { AppError } from "../../../middleware/error";
import User from "../../models/user/user.model";

const userRepo = new UserRepository();

export default class UserService {
  // Create user with permissions
  async createUser(payload: {
    name: string;
    email: string;
    password: string;
    identificationNo?: string;
    role: string;
    status?: string;
    permissions?: Record<string, string[]>;
    permissionsList?: string[];
  }) {
    const { name, email, password, role, status, permissions, permissionsList, identificationNo } = payload;

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

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
  async updateUser(
    id: number,
    data: {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
      status?: string;
      permissions?: Record<string, string[]>;
      permissionsList?: string[];
    }
  ) {
    if (!id) throw new Error("Invalid user ID");

    const updateData: any = { ...data };

    const updatedUser = await userRepo.update(id, updateData);
    if (!updatedUser) throw new Error("User not found");

    return updatedUser;
  }

  // Other existing methods
  async getAllUsers() {
    return userRepo.findAll();
  }

  async getUserById(id: number) {
    if (!id) throw new Error("Invalid user ID");
    return userRepo.findById(id);
  }

  async deleteUser(id: number) {
    if (!id) throw new Error("Invalid user ID");
    return userRepo.delete(id);
  }

  async loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await userRepo.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user?.dataValues.password))) throw new Error("Invalid credentials");
    if (user.dataValues.status.toLocaleLowerCase() !== "active") throw new Error("User account is not active");
    const { accessToken, refreshToken } = await ACCESS_TOKEN({
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

  async findUserByEmail(email: string): Promise<any> {
    return userRepo.findByEmail(email);
  }

  async updateUserPassword(
    email: string,
    currentPassword: string,
    newPassword: string,
    identificationNo?: string
  ): Promise<User> {
    try {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      if (identificationNo && user.dataValues.identificationNo !== identificationNo) {
        throw new AppError('Identification number does not match', 400);
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      return await userRepo.updatePasswordWithHash(user, hashedPassword);
    } catch (error: any) {
      throw new Error(error.message || "Failed to update password");
    }
  }
}
