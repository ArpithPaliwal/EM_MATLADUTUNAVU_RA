import { Server, Socket } from "socket.io";


export const registerConversationEvents = (
  io: Server,
  socket: Socket
) => {
  socket.on("conversation:join", (conversationIds: string[]) => {
    conversationIds.forEach((id) => {
      socket.join(`conversation:${id}`);
    });
  });

  socket.on("conversation:active", (conversationId: string) => {
    socket.data.activeConversations.add(conversationId);
  });

  socket.on("conversation:inactive", (conversationId: string) => {
    socket.data.activeConversations.delete(conversationId);
  });
};
