import { Server, Socket } from "socket.io";


export const registerConversationEvents = (
  io: Server,
  socket: Socket
) => {

  socket.on("conversation:join", (payload: any) => {
    let conversationIds: string[] = [];

    if (Array.isArray(payload)) {
        conversationIds = payload;
    } else if (typeof payload === "string") {
        // If it looks like a list "['abc', 'def']", parse it. If not, just wrap it.
        try {
            const parsed = JSON.parse(payload);
            conversationIds = Array.isArray(parsed) ? parsed : [payload];
        } catch {
            conversationIds = [payload];
        }
    }
  conversationIds.forEach((id: string) => {
    console.log(`📢 RECEIVED JOIN REQUEST from Socket ${socket.id} for payload:`, conversationIds);
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
