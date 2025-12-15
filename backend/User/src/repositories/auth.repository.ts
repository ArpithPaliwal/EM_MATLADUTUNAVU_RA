import { User } from "../models/user.model.js";
import type { SignupDTO } from "../dtos/signup.dto.js";
import type { IAuthRepository } from "./interfaces/auth.repository.interface.js";

export class AuthRepository implements IAuthRepository{
    async createUser(data: SignupDTO): Promise<any> {
        return User.create(data)
    }
}
