import type { SignupInitiateDTO } from "../../dtos/signup.dto.js";


export interface IAuthService {
    signupInitiate(data:SignupInitiateDTO,avatarLocalPath?: string):Promise<any>;
    signupVerifyCode(email:string,code:string):Promise<any>;
}

