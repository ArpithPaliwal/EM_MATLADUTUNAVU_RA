import type { Request, Response } from "express";
import type { IAuthController } from "./auth.controller.interface.js";
import type { IAuthService } from "../../services/interfaces/auth.service.interface.js";
import { AuthService } from "../../services/auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type { signupDTO } from "../../dtos/signup.dto.js";

export class AuthController implements IAuthController{
    constructor(private authService:IAuthService = new AuthService()){

    }
    signup = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const signupData: signupDTO = req.body;

      const result = await this.authService.signup(signupData);

      return res
        .status(201)
        
    }
  );
}
