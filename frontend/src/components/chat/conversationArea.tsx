import type { ConversationListResponseDto } from "../../dto/chatListResponse.dto";
import ConversationHeader from "./ConversationHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type Props = {
  conversation: ConversationListResponseDto | null;
};

export default function ConversationArea({ conversation }: Props) {
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      <ConversationHeader conversation={conversation} />

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <MessageList conversationId={conversation._id} />
      </div>

      <div className="border-t">
        <MessageInput conversationId={conversation._id} />
      </div>
    </div>
  );
}
