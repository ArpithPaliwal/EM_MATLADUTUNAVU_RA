import api from "../utils/axiosinstanceChat.js";
import { AxiosError } from "axios";
import type {ApiError} from "../dto/apiError"
import type { MessageResponseDto } from "../dto/messages.dto.js";
import { createFormData } from "../utils/createFormData.js";



export const  getMessages= async (conversationId:string):Promise<MessageResponseDto[]> =>{
    try {
      console.log("sent succe");
      
         const res = await api.get(`/chat/messages/getMessages/${conversationId}`, { withCredentials: true});
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



export const uploadMedia = async (
  file: File
): Promise<{ filePath: string }> => {
  try {
    const form = createFormData({ file });

    const res = await api.post(
      "/uploads/message",
      form,
      { withCredentials: true }
    );

    return res.data.data;   // assuming { data: { filePath } }
  } 
  catch (error: unknown) {

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
};
