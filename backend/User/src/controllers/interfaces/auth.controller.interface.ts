import type { RequestHandler } from "express";

export interface IAuthController {
  signup: RequestHandler;
}
