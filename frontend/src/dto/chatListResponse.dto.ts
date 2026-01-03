export type ConversationBase = {
  id: string;
  type: "direct" | "group";

  members: string[];
  createdBy: string;

  unreadCount: number;
    lastMessageId?: string;
    lastMessageText?: string;
    lastMessageSenderId?: string;
    lastMessageCreatedAt?: string;
  

  createdAt: string;
  updatedAt: string;
};
export type DirectConversation = ConversationBase & {
  type: "direct";

  partner: {
    id: string;
    username: string;
    avatar?: string;
  };
};
export type GroupConversation = ConversationBase & {
  type: "group";

  groupName: string;

  groupAvatar?: {
    url: string;
    publicId?: string;
  };
};
export type ChatListResponseDto =
  | DirectConversation
  | GroupConversation;
