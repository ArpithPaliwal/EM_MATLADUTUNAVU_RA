import api from "../utils/axiosInstanceChat";
import { AxiosError } from "axios";
import type {ApiError} from "../dto/apiError"


export const  getChatList= async (formData: FormData):Promise<ChatListResponseDto> =>{
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