import type { IConversationParticipantRepository } from "./interfaces/conversationParticipant..repository.interface.js";
import type { CreateConversationParticipantDTO } from "../dtos/createConversationParticipant.dto.js";
import { ConversationParticipant } from "../models/conversationParticipant.model.js";
import type { ClientSession } from "mongoose";

export class ConversationParticipantRepository implements IConversationParticipantRepository {
    async createConversationParticipants(data: CreateConversationParticipantDTO,session:ClientSession): Promise<void> {
        // Implementation for creating conversation participants in the database
        const { userIds, conversationId } = data;
        const docs = userIds.map(userId => ({ userId, conversationId }));
        // Assume ConversationParticipantModel is a Mongoose model
        await ConversationParticipant.insertMany(docs, { session }  );
    }   
}