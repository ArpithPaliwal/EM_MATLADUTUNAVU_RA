import type { SignupDTO } from "../../dtos/signup.dto.js";

export interface IAuthRepository {

    createUser(data:SignupDTO,avatar:string):Promise<any>;
    findUser(data:SignupDTO):Promise<any>;
    findUserById(id:string):Promise<any>;
}