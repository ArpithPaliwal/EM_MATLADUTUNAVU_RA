import type {ApiError} from "../dto/apiError"
import type {  RegisterResponseDto } from "../dto/auth.dto";
import api from "../utils/axiosInstance";
import { AxiosError } from "axios";

export const registerUser = async (formData: FormData):Promise<RegisterResponseDto> =>{
    try {
         const res = await api.post("/users/register", formData,{ withCredentials: true});

    
    
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