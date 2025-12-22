import type { createGroupConversationDTO, PrivateConversationDTO } from "../../dtos/createPrivateConversation.dto.js";

export interface IConversationRepository {
    createPrivateConversation(data: PrivateConversationDTO,session:any): Promise<any>;
    checkExistingPrivateConversation(data: PrivateConversationDTO): Promise<any>;
    createGroupConversation(data: createGroupConversationDTO,session:any): Promise<any>;
}