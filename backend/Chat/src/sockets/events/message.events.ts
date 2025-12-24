import { Server } from "socket.io";
import { ConversationParticipantService } 
  from "../../services/conversationParticipant.service.js";

const conversationParticipantService =
  new ConversationParticipantService();

export const emitMessageEvents = async (
  io: Server,
  message: any
) => {
  const { conversationId, senderId } = message;
  console.log("🔍 DEBUG: Full Message Object:", message);

  

  // 2. Log the exact room name we are trying to talk to
  const roomName = `conversation:${conversationId}`;
  console.log(`📢 DEBUG: Emitting to Room: '${roomName}'`);

  // 3. Check if anyone is actually inside that room
  const sockets = await io.in(roomName).fetchSockets();
  console.log(`👥 DEBUG: Sockets found in room '${roomName}':`, sockets.length);

  // The actual emit
  io.to(roomName).emit("message:new", message);
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

    if (!isActive) {
     
      io.to(`user:${targetUserId}`).emit("conversation:unreadUpdate", {
        conversationId,
        incrementBy: 1,
      });

      
      await conversationParticipantService
        .updateConversationParticipants(message, targetUserId);
    }
  }
};
