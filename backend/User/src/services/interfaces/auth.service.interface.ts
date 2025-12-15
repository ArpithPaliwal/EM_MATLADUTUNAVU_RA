import type { SignupDTO } from "../../dtos/signup.dto.js";

export interface IAuthService {
    signup(data:SignupDTO):Promise<any>;
}

