import type { IConversationParticipantService } from "./interfaces/createConversationParticipant.service.interface.js";
import type { CreateConversationParticipantDTO } from "../dtos/createConversationParticipant.dto.js";



export class ConversationParticipantService implements IConversationParticipantService {
    async createConversationParticipants(data: CreateConversationParticipantDTO): Promise<void> {
        // Implementation for creating conversation participants
    }
}