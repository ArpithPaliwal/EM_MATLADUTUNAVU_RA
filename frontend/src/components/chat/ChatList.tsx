import type { ConversationListResponseDto } from "../../dto/chatListResponse.dto";
import { useConversations } from "../../hooks/useConversationList";
import ChatListItem from "./ChatListItem";

type props = {
  selectedChatId: string | null;
  onSelect: (id: string) => void;
};
export default function ChatList({ selectedChatId, onSelect }: props) {
  const { data, isLoading ,error} = useConversations();

  if (isLoading) return <div>Loading…</div>;
    if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="h-full overflow-y-auto">
      {data?.map((c: ConversationListResponseDto) => (
        <ChatListItem
          key={c.id}
          conversation={c}
          onSelect={onSelect}
          isActive={c.id === selectedChatId}
        />
      ))}
    </div>
  );
}
