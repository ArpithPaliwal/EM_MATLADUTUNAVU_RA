import { useMutation } from "@tanstack/react-query";
import { createNewPrivateConversation } from "../API/chatApi";
import type { ConversationListResponseDto } from "../dto/chatListResponse.dto";
import type { ApiError } from "../dto/apiError";


// export function useCreatePrivateConversation() {
//   return useMutation<
//     ConversationListResponseDto[],
//     ApiError,
//     { memberId: string }
//   >({
//     mutationFn: createNewPrivateConversation,
//   });
// }
export function useCreatePrivateConversation() {
  return useMutation<
    ConversationListResponseDto[],
    ApiError,
    { memberUsername: string }
  >({
    mutationFn: createNewPrivateConversation,

    onSuccess: (data, variables) => {
      console.log("Private conversation created successfully");
      console.log("Payload:", variables);
      console.log("Response:", data);
    },

    onError: (error, variables) => {
      console.error("Failed to create private conversation");
      console.error("Payload:", variables);
      console.error("Error message:", error.message);
    },
  });
}
