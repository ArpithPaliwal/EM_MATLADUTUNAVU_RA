import { Server, Socket } from "socket.io";


export const registerMessageEvents = (
  io: Server,
  socket: Socket
) => {
  socket.on(
    "message:send",
    async ({ conversationId, text }: { conversationId: string; text: string }) => {
      const senderId = socket.data.userId;

      const message = {
        conversationId,
        senderId,
        text,
        createdAt: new Date(),
      };

      io.to(`conversation:${conversationId}`).emit("message:new", message);

      const socketsInRoom = await io
        .in(`conversation:${conversationId}`)
        .fetchSockets();

      const processedUsers = new Set<string>();

      for (const s of socketsInRoom) {
        const targetUserId = s.data.userId;

        if (targetUserId === senderId) continue;
        if (processedUsers.has(targetUserId)) continue;

        processedUsers.add(targetUserId);

        const isActive = socketsInRoom.some(
          (sock) =>
            sock.data.userId === targetUserId &&
            sock.data.activeConversations.has(conversationId)
        );

        if (isActive) continue;

        io.to(`user:${targetUserId}`).emit("conversation:unreadUpdate", {
          conversationId,
          incrementBy: 1,
        });
      }
    }
  );
};
