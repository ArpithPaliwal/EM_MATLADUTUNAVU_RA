import type { signupDTO } from "../../dtos/signup.dto.js";

export interface IAuthRepository {

    createUser(data:signupDTO):Promise<any>;
}