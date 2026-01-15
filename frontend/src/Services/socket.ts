import { io } from "socket.io-client";
import type { MessageResponseDto } from "../dto/messages.dto";

// export const socket: Socket = io(
//   import.meta.env.VITE_API_BASE_CHAT_SOCKET as string,
//   {
//     withCredentials: true,
//     autoConnect: false,
//     // auth: {
//     //   token: localStorage.getItem("accessToken"),
//     // },
//   }
// );
export const socket = io(import.meta.env.VITE_API_BASE_CHAT_SOCKET, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: false,
});

let pendingConversationIds: string[] = [];
let lastActiveConversation: string | null = null;

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);

  if (pendingConversationIds.length) {
    socket.emit("conversation:join", pendingConversationIds);
  }

  if (lastActiveConversation) {
    socket.emit("conversation:active", lastActiveConversation);
  }
});
export const connectSocket = () => {
  if (!socket.connected) socket.connect();
  console.log("SOCKET CONNECTED:", socket.id);
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};
export const joinConversations = (conversationIds: string[]) => {
  pendingConversationIds = conversationIds;

  if (!socket.connected) return;

  socket.emit("conversation:join", conversationIds);
};

export const activeConversation = (conversationId: string) => {
  lastActiveConversation = conversationId;

  if (!socket.connected) return;

  socket.emit("conversation:active", conversationId);
};

export const inActiveConversation = (conversationId: string) => {
  if (!socket.connected) return;

  if (lastActiveConversation === conversationId) {
    lastActiveConversation = null;
  }

  socket.emit("conversation:inactive", conversationId);
};
export const onMessageNew = (cb: (msg: MessageResponseDto) => void) => {
  socket.on("message:new", cb);

  return () => socket.off("message:new", cb);
};

export const onMessageDeleted = (
  cb: (payload: { messageId: string }) => void
) => {
  socket.on("message:deleted", cb);
  return () => socket.off("message:deleted", cb);
};




export const deleteMessage = (payload: {
  messageId: string;
  senderId: string;
}) => {
  console.log("frontend dlt ",payload);
  
  socket.emit("message:delete", payload);
};

type SendMessageAck =
  | { ok: true; message: MessageResponseDto }
  | { ok: false; error: string };

export const sendMessage = (
  payload: unknown,
  cb?: (msg: MessageResponseDto) => void,
  onError?: (err: unknown) => void
) => {
  socket.emit("message:send", payload, (res: SendMessageAck) => {
    if (!res.ok) {
      onError?.(res.error);
      return;
    }

    cb?.(res.message);
  });
};

export const resetUnread = (conversationParticipantId: string | undefined) => {
  socket.emit("conversationParticipant:unreadCount", conversationParticipantId);
};


export const onUnreadUpdate = (
  cb: (payload: { conversationId: string; incrementBy: number ,text:string}) => void
) => {
  socket.on("conversation:unreadUpdate", cb);

  return () => {
    socket.off("conversation:unreadUpdate", cb);
  };
};
