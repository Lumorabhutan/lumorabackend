import { Request, Response } from "express";
import UserService from "../../handler/user/user.handler";
import { access } from "fs";

const userService = new UserService();

export const UserController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, message: "User created successfully", data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await userService.updateUser(id, req.body);
      res.status(200).json({ success: true, message: "User updated successfully", data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await userService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await userService.deleteUser(id);
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },
  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // loginUser returns { accessToken, refreshToken }
      const token = await userService.loginUser(email, password);
       const isProd = process.env.NODE_ENV === "production";
      // Set cookies (HTTP Only, secure in production)
      res.cookie("accessToken", token.accessToken, {
        httpOnly: false,      // cannot be accessed by JS
        secure: true, // only HTTPS in prod
        sameSite: "none", // CSRF protection
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: "/",           // cookie accessible on all routes
      });

      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: false,      // cannot be accessed by JS
        secure: true, // only HTTPS in prod
        sameSite: "none", // CSRF protection
        // sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Respond with minimal info (you could also skip sending tokens in body)
      res.status(200).json({ success: true, message: "Login successful", accessToken: token.accessToken, refreshToken: token.refreshToken });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },
  updateUserPassword: async (req: Request, res: Response): Promise<void> => {
    console.log("🔒 Password update request received");
    try {
      const { password, newpassword, email, identificationNo } = req.body;
      console.log("🔒 Request body:", req.body);
      await userService.updateUserPassword(email, password, newpassword, identificationNo);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
      console.error("❌ Error updating password:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
};
