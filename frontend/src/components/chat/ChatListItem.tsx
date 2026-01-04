import type  { ConversationListResponseDto } from "../../dto/chatListResponse.dto";

type Props = {
  conversation: ConversationListResponseDto;
  onSelect: (id: string) => void;
  isActive: boolean;
};

export default function ChatListItem({
  conversation,
  onSelect,
  isActive,
}: Props) {
  const name =
    conversation.type === "direct"
      ? conversation.partner?.username
      : conversation.groupName;

  const avatar =
    conversation.type === "direct"
      ? conversation.partner?.avatar
      : conversation.groupAvatar?.url;

  const lastMessage = conversation.lastMessageText?? "start the conversation";

  return (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer 
        ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`}
      onClick={() => onSelect(conversation.id)}
    >
      {/* Avatar */}
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Texts */}
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-500 truncate">
          {lastMessage}
        </div>
      </div>

      {/* Unread badge */}
      {conversation.unreadCount > 0 && (
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          {conversation.unreadCount}
        </span>
      )}
    </div>
  );
}
