import type { createGroupConversationDTO, PrivateConversationDTO } from "../../dtos/createPrivateConversation.dto.js";

export interface IConversationService {
    createPrivateConversation(data: PrivateConversationDTO): Promise<any>;
    createGroupConversation(data: createGroupConversationDTO): Promise<any>;
}