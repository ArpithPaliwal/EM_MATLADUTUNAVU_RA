import api from "../utils/axiosinstanceChat.js";
import { AxiosError } from "axios";
import type { ApiError } from "../dto/apiError";
import type { ConversationListResponseDto } from "../dto/chatListResponse.dto";

export const getConversationsList = async (): Promise<
  ConversationListResponseDto[]
> => {
  try {
    console.log("sent succe");

    const res = await api.get("/chat/conversations/getUserConversations", {
      withCredentials: true,
    });
    console.log("check");

    console.log(res);

    return res.data.data;
  } catch (error: unknown) {
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

export const createNewPrivateConversation = async ({
  memberUsername,
}: {
  memberUsername: string;
}): Promise<ConversationListResponseDto[]> => {
  try {
    console.log("sent succe");

    const res = await api.post(
      "/chat/conversations/createPrivateConversation",
      { memberUsername },
      { withCredentials: true }
    );
    console.log("check");

    console.log(res);

    return res.data.data;
  } catch (error: unknown) {
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
export const createNewGroupConversation = async ({
  name,
  image,
  members,
}: {
  name: string;
  image?: File;
  members: string[] | string;
}): Promise<ConversationListResponseDto[]> => {
  try {
    const formData = new FormData();

    formData.append("groupName", name);

    if (image) {
      formData.append("groupAvatar", image);
    }

   
    const safeMembers = Array.isArray(members) ? members : [members];

formData.append("memberIds", JSON.stringify(safeMembers));
    for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

    
    const res = await api.post(
      "/chat/conversations/createGroupConversation",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.data;
  } catch (error: unknown) {
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
