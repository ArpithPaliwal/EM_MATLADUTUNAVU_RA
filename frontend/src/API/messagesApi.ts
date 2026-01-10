import api from "../utils/axiosinstanceChat.js";
import { AxiosError } from "axios";
import type {ApiError} from "../dto/apiError"
import type { MessagePage } from "../dto/messages.dto.js";
import { createFormData } from "../utils/createFormData.js";



export const  getMessages= async (conversationId:string,cursor:string | null ):Promise<MessagePage> =>{
    try {
      console.log("sent succe");
      
         const res = await api.get(`/chat/messages/getMessages/${conversationId}?cursor=${cursor || ""}`, { withCredentials: true});
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
    const form = createFormData({ userUploadedMediaFile: file });


    const res = await api.post(
      "/chat/messages/uploadFile",
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
