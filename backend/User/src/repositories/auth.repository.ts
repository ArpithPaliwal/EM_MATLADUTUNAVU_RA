import { User } from "../models/user.model.js";
import type { signupDTO } from "../dtos/signup.dto.js";
import type { IAuthRepository } from "./interfaces/auth.repository.interface.js";

export class AuthRepository implements IAuthRepository{
    async createUser(data: signupDTO): Promise<any> {
        return User.create(data)
    }
}
