import { Server } from "socket.io";
import { ConversationParticipantService }
  from "../../services/conversationParticipant.service.js";

const conversationParticipantService =
  new ConversationParticipantService();

import { ConversationService } from "../../services/conversation.service.js";
const conversationService = new ConversationService();

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

  io.to(`conversation:${conversationId}`).emit("message:new", message);


  const socketsInRoom = await io
    .in(`conversation:${conversationId}`)
    .fetchSockets();

  const activeUsers = new Set<string>();

  for (const socket of socketsInRoom) {
    if (
      socket.data.userId &&
      socket.data.activeConversations?.has(conversationId)
    ) {
      activeUsers.add(socket.data.userId);
    }
  }
  const allMembers = await conversationService.getConversationMembers(
    conversationId
  );
  for (const member of allMembers) {
  if (member.userId === senderId) continue;

  const isActive = activeUsers.has(member.userId);

  if (!isActive) {
    io.to(`user:${member.userId}`).emit("conversation:unreadUpdate", {
      conversationId,
      incrementBy: 1,
    });

    await conversationParticipantService.updateConversationParticipants(
      message,
      member.userId
    );
  }
}


};
