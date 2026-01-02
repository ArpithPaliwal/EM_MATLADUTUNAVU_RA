import type {ApiError} from "../dto/apiError"
import type {  RegisterResponseDto } from "../dto/auth.dto";
import api from "../utils/axiosInstanceUser";
import { AxiosError } from "axios";

export const initiateRegisterUser = async (formData: FormData):Promise<void> =>{
    try {
      console.log("sent succe");
      
         const res = await api.post("/users/signupInitialize", formData,{ withCredentials: true});
      console.log("check");
    
    console.log(res);
    
    
    return res.data.data ;
    } catch (error:unknown) {
        

    if (error instanceof AxiosError && error?.response) {
      const apiError: ApiError = {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };

      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
    }
}
type SubmitOtpPayload = {
  email: string;
  otpValue: string;
};

export const submitOtp = async ({ email, otpValue}:SubmitOtpPayload):Promise<RegisterResponseDto> =>{
    try {
         const res = await api.post("/users/signupVerifyCode", { otp: otpValue, email }, { withCredentials: true });

    console.log("check");
    
    console.log(res);
    
    return res.data.data ;
    } catch (error:unknown) {
        

    if (error instanceof AxiosError && error?.response) {
      const apiError: ApiError = {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };

      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
    }
}
export const loginUser = async (data: {username:string,password:string}):Promise<RegisterResponseDto> =>{
    try {
         const res = await api.post("/users/login", data, { withCredentials: true });   
    return res.data.data ;
    } catch (error:unknown) {
    if (error instanceof AxiosError && error?.response) {
      const apiError: ApiError = {

        status: error.response.status,      
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };

      throw apiError;
    }

    throw {
      status: 500,
      message: "Network error or server is down",
      errors: [],
    } as ApiError;
  }
}