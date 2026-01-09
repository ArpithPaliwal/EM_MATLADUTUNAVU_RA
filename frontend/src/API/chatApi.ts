import api from "../utils/axiosinstanceChat.js";
import { AxiosError } from "axios";
import type {ApiError} from "../dto/apiError"
import type { ConversationListResponseDto } from "../dto/chatListResponse.dto";


export const  getConversationsList= async ():Promise<ConversationListResponseDto[]> =>{
    try {
      console.log("sent succe");
      
         const res = await api.get("/chat/conversations/getUserConversations", { withCredentials: true});
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


export const  createNewPrivateConversation= async ({ memberUsername }: { memberUsername: string }) :Promise<ConversationListResponseDto[]> =>{
    try {
      console.log("sent succe");
      
         const res = await api.post("/chat/conversations/createPrivateConversation",{memberUsername} ,{ withCredentials: true});
      console.log("check");
    
    console.log(res);
    
    
    return res.data.data;
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