import type { SignupInitiateDTO } from "../dtos/signup.dto.js";
import { User } from "../models/user.model.js";

import type { IAuthRepository } from "./interfaces/auth.repository.interface.js";

export class AuthRepository implements IAuthRepository {
    async createUser(data: SignupInitiateDTO, avatar: string, refreshToken: string): Promise<any> {
        const { username, email, password } = data
        return await User.create({
            username: username.toLowerCase(), email, password, avatar, refreshToken
        })
    }
    async findUser(data: SignupInitiateDTO): Promise<any> {
        const { username, email } = data;
        return await User.findOne({
            $or: [{ username }, { email }]
        });
    }
    async findUserById(id: string): Promise<any> {
        return await User.findById(id).select('-password -refreshToken')
    }
    async updateUsername(userId: string, newUsername: string): Promise<any> {
        return await User.findByIdAndUpdate(
            userId,
            { username: newUsername.toLowerCase() },
            { new: true }
        ).select('-password -refreshToken -email -avatar');
    }
    async updateAvatar(userId: string, avatarLocalPath: string): Promise<any> {
        return await User.findByIdAndUpdate(
            userId,
            { avatar: avatarLocalPath },
            { new: true }
        ).select('-password -refreshToken -email -username');
    }
    async updatePassword(userId: string, hashedPassword: string): Promise<any> {
        return await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );
    }
}
