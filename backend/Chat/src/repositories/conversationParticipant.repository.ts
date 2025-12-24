import type { IConversationParticipantRepository } from "./interfaces/conversationParticipant..repository.interface.js";
import type { CreateConversationParticipantDTO } from "../dtos/createConversationParticipant.dto.js";
import { ConversationParticipant } from "../models/conversationParticipant.model.js";
import type { ClientSession } from "mongoose";

export class ConversationParticipantRepository implements IConversationParticipantRepository {
    async createConversationParticipants(data: CreateConversationParticipantDTO,session:ClientSession): Promise<void> {
        
        const { userIds, conversationId } = data;
        const docs = userIds.map(userId => ({ userId, conversationId }));
        
        await ConversationParticipant.insertMany(docs, { session }  );
    }   
    async updateConversationParticipants(_id: string, userId: string, conversationId: string, senderId: string): Promise<void> {
        await ConversationParticipant.updateOne(
            { userId, conversationId, lastReadMessageId: _id, senderId },
            { $inc: { unreadCount: 1 } }
        );
    }
}