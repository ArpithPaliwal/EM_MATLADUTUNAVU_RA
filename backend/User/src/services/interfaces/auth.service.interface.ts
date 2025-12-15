import type { signupDTO } from "../../dtos/signup.dto.js";

export interface IAuthService {
    signup(data:signupDTO):Promise<any>;
}

