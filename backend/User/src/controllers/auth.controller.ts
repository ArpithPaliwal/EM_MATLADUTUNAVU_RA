import type { Request, Response } from "express";
import type { IAuthController } from "./interfaces/auth.controller.interface.js";
import type { IAuthService } from "../services/interfaces/auth.service.interface.js";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/apiResponse.js";
import type { SignupInitiateDTO } from "../dtos/signup.dto.js";
import { ApiError } from "../utils/apiError.js";


export class AuthController implements IAuthController {
  constructor(private authService: IAuthService = new AuthService()) {

  }
  signupInitiate = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const signupData: SignupInitiateDTO = req.body;
      const avatarLocalPath = req.file?.path;
      await this.authService.signupInitiate(signupData, avatarLocalPath);

      return res
        .status(201)
        .json(
          new ApiResponse(200, null, 'verification code sent to email')
        );

    }
  );
  signupVerifyCode = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw new ApiError(400, "Email and verification code are required");
      }

      const result = await this.authService.signupVerifyCode(email, otp);


      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
      });

      const { accessToken, refreshToken, ...userData } = result;


      return res.status(200).json(
        new ApiResponse(
          200,
          userData,
          "User registered successfully"
        )
      );
    }
  );
  login = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const user = await this.authService.login(req.body);
      const { accessToken, refreshToken, ...userData } = user;
      res.cookie("accessToken", user.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
      });

      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
      });
      return res.status(200).json(
        new ApiResponse(200, userData, "Login successful")
      );
    }
  )
  checkUsernameAvailability = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { username } = req.params;
      if (!username || username.trim() === "" || username === undefined) {
        throw new ApiError(400, "Username is required");
      }
      const isAvailable = await this.authService.isUsernameAvailable(username?.toLowerCase());
      return res.status(200).json(
        new ApiResponse(200, { isAvailable }, "Username availability checked")
      );
    }
  )
  updateUsername = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?._id;
      const { username } = req.body;

      if (!username || username.trim() === "" || username === undefined) {
        throw new ApiError(400, "Username is required");
      }
      const isAvailable = await this.authService.isUsernameAvailable(username?.toLowerCase());
      if (!isAvailable) {
        throw new ApiError(409, "Username is already taken");
      }

      const updatedUsername = await this.authService.updateUsername(userId, username?.toLowerCase());

      return res.status(200).json(
        new ApiResponse(200, { username: updatedUsername }, "Username updated successfully")
      )
    }
  )
  updateAvatar = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?._id;
      const avatarLocalPath:string | undefined = req.file?.path;
      if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
      }
      const updatedAvatarUrl:string | undefined = await this.authService.updateAvatar(userId, avatarLocalPath);
      if(!updatedAvatarUrl){
        throw new ApiError(500, "Failed to update avatar");
      }
      return res.status(200).json(
        new ApiResponse(200, { avatarUrl: updatedAvatarUrl }, "Avatar updated successfully")
      )
    } 
  )
  updatePassword = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const username = req.user?.username;
      const userId = req.user?._id;
      const { currentPassword, newPassword } = req.body; 
      if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current password and new password are required");
      }
      const updatedPassword = await this.authService.updatePassword(username, userId, currentPassword, newPassword);
      if(updatedPassword===undefined){
        throw new ApiError(500, "Failed to update password");
      }
      return res.status(200).json(
        new ApiResponse(200, null, "Password updated successfully")
      )
    } 
  )
  getUserInBulk = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userIds: string[] = req.body.userIds; 
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new ApiError(400, "User IDs array is required");
      }
      const users = await this.authService.getUserInBulk(userIds);  
      return res.status(200).json(
        new ApiResponse(200, { users }, "Users fetched successfully")
      )
    } 
  )
  userExists = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { userId } = req.params;
      if (!userId || userId.trim() === "" || userId === undefined) {
        throw new ApiError(400, "User ID is required");
      }
      const exists = await this.authService.userExists(userId);
      return res.status(200).json(
        new ApiResponse(200, exists , "User existence checked successfully")
      )
    }
  )
}