import type { Request, Response } from "express";
import type { IAuthController } from "./interfaces/auth.controller.interface.js";
import type { IAuthService } from "../services/interfaces/auth.service.interface.js";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { SignupDTO } from "../dtos/signup.dto.js";
import { ApiResponse } from "../utils/apiResponse.js";

export class AuthController implements IAuthController{
    constructor(private authService:IAuthService = new AuthService()){

    }
    signup = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const signupData: SignupDTO = req.body;
      const avatarLocalPath = req.file?.path; 
      const result = await this.authService.signup(signupData,avatarLocalPath);

      return res
        .status(201)
        .json(
            new ApiResponse(200, result, 'User registered successfully ')
        );
        
    }
  );
}
