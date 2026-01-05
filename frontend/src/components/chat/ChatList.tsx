import type { ConversationListResponseDto } from "../../dto/chatListResponse.dto";
import { useConversations } from "../../hooks/useConversationList";
import { joinConversations } from "../../Services/socket";
import ChatListItem from "./ChatListItem";
import { useEffect } from "react";

type props = {
  selectedChat: ConversationListResponseDto | null;
  onSelect: (conversation : ConversationListResponseDto) => void;
};
export default function ChatList({ selectedChat, onSelect }: props) {
  const { data, isLoading ,error} = useConversations();
    useEffect(() => {
    if (!data) return;

    const ids = data.map(c => c.id);   
    joinConversations(ids);          
  }, [data]);        
  if (isLoading) return <div>Loading…</div>;
    if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="h-full overflow-y-auto rounded-2xl ">
      {data?.map((c: ConversationListResponseDto) => (
        <ChatListItem
          key={c.id}
          conversation={c}
          onSelect={onSelect}
          isActive={c.id === selectedChat?.id}
        />
      ))}
    </div>
  );
}
