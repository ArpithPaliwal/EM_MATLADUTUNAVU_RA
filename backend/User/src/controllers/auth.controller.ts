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

}
