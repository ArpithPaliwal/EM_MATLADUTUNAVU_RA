import type { CreateConversationParticipantDTO } from "../../dtos/createConversationParticipant.dto.js";

export interface IConversationParticipantRepository {
    createConversationParticipants(data: CreateConversationParticipantDTO, session: any): Promise<void>;
}