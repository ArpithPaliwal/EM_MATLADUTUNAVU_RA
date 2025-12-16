import type { SignupDTO } from "../dtos/signup.dto.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import type { IAuthRepository } from "../repositories/interfaces/auth.repository.interface.js";
import { ApiError } from "../utils/apiError.js";
import type { IAuthService } from "./interfaces/auth.service.interface.js";
import path from "path";
import fs from "fs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { hashPassword } from "../utils/password.utils.js";


const tempFolder = path.resolve("public", "temp");
export class AuthService implements IAuthService {

//   private authRepository: IAuthRepository;

//   constructor() {
//     this.authRepository = new AuthRepository();
//   }
    constructor(private authrepository: IAuthRepository = new AuthRepository()) {

    }

    async signup(data: SignupDTO,avatarLocalPath:string) {
        const {username,email,password}= data;
        if (
        [ email, username, password].some(
            (field) => field?.trim() == ''
        )
    ) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser:Boolean = await this.authrepository.findUser(data)
    if(existedUser)
    {
        try {
            if(fs.existsSync(tempFolder)){
                const files = fs.readdirSync(tempFolder);
                files.forEach((file) => {
                    const filePath = path.join(tempFolder, file);
                    fs.unlinkSync(filePath);
                    console.log('Deleted file:', filePath);
                });
                console.log('All files in temp folder deleted.');
            }
        } catch (error) {
            console.error('Error deleting files in temp folder:', error);
        }
        throw new ApiError(
            409,
            'User with this email or username already exists'
        );
    }
    console.log('Uploading to Cloudinary:', avatarLocalPath);
    const avatar:any = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, 'Avatar files is required');
    }else{
        console.log('Cloudinary response:', avatar);
    }

    const hashedPassword = await hashPassword(data.password)
    const user = await this.authrepository.createUser({ ...data, password: hashedPassword },avatar?.secure_url)

    const createdUser = await this.authrepository.findUserById(user._id);

    if (!createdUser) {
        throw new ApiError(
            500,
            'Something went wrong while registering the user'
        );
    }

    return createdUser;
    }
}