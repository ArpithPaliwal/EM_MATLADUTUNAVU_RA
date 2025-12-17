import type { RequestHandler } from "express";

export interface IAuthController {
  signupInitiate: RequestHandler;
  signupVerifyCode: RequestHandler;
  login: RequestHandler;
}
