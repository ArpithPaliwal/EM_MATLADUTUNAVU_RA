import type { signupDTO } from "../dtos/signup.dto.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import type { IAuthRepository } from "../repositories/interfaces/auth.repository.interface.js";
import type { IAuthService } from "./interfaces/auth.service.interface.js";

export class AuthService implements IAuthService {

//   private authRepository: IAuthRepository;

//   constructor() {
//     this.authRepository = new AuthRepository();
//   }
    constructor(private authrepository: IAuthRepository = new AuthRepository()) {

    }

    async signup(data: signupDTO) {

    }
}