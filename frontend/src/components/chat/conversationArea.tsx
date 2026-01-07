import type { ConversationListResponseDto } from "../../dto/chatListResponse.dto";
import ConversationHeader from "./ConversationHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useQueryClient } from "@tanstack/react-query";


type Props = {
  conversation: ConversationListResponseDto | null;
  userId: string | undefined;
};

export default function ConversationArea({ conversation, userId }: Props) {
  const queryClient = useQueryClient();
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }
  if (conversation) {
  if (conversation.unreadCount > 0) {
    queryClient.setQueryData<ConversationListResponseDto[]>(
      ['conversations'],
      (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((item) =>
          item._id === conversation._id
            ? { ...item, unreadCount: 0 }
            : item
        );
      }
    );
  }
}

  return (
    <div className="flex flex-col h-full min-h-0">
      <ConversationHeader conversation={conversation} />

      <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
        <MessageList conversationId={conversation._id} />
      </div>

      <div className="border-t">
        <MessageInput conversationId={conversation._id} senderId={userId} />
      </div>
    </div>
  );
}
