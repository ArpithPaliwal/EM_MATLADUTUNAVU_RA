import { Server } from "socket.io";

export const emitMessageEvents = async (
  io: Server,
  message: any
) => {
  const { conversationId, senderId } = message;


  io.to(`conversation:${conversationId}`).emit("message:new", message);

  const socketsInRoom = await io
    .in(`conversation:${conversationId}`)
    .fetchSockets();

  const processedUsers = new Set<string>();

  for (const s of socketsInRoom) {
    const targetUserId = s.data.userId;

    if (!targetUserId || targetUserId === senderId) continue;
    if (processedUsers.has(targetUserId)) continue;

    processedUsers.add(targetUserId);

    const isActive = socketsInRoom.some(
      (sock) =>
        sock.data.userId === targetUserId &&
        sock.data.activeConversations.has(conversationId)
    );

    // if (!isActive) {
    //   io.to(`user:${targetUserId}`).emit("conversation:unreadUpdate", {
    //     conversationId,
    //     incrementBy: 1,
    //   });
    if(!isActive){
      await this.
    }
  }
}

