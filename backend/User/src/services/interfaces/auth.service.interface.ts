import type { SignupDTO } from "../../dtos/signup.dto.js";

export interface IAuthService {
    signup(data:SignupDTO,avatarLocalPath?: string):Promise<any>;
}

