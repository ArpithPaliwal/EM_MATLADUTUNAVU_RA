import { User } from "../models/user.model.js";
import type { SignupDTO } from "../dtos/signup.dto.js";
import type { IAuthRepository } from "./interfaces/auth.repository.interface.js";

export class AuthRepository implements IAuthRepository {
    async createUser(data: SignupDTO, avatar: string): Promise<any> {
        const { username, email, password } = data
        return await User.create({
            username: username.toLowerCase(), email, password, avatar
        })
    }
    async findUser(data: SignupDTO): Promise<any> {
        const { username, email } = data;
        return await User.findOne({
            $or: [{ username }, { email }]
        })
    }
    async findUserById(id: string): Promise<any> {
        return await User.findById(id).select('-password -refreshToken')
    }
}
