import type { SignupDTO } from "../../dtos/signup.dto.js";

export interface IAuthRepository {

    createUser(data:SignupDTO):Promise<any>;
}