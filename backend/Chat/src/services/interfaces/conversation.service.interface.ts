import type { createGroupConversationDTO, PrivateConversationDTO } from "../../dtos/createPrivateConversation.dto.js";

export interface IConversationService {
    createPrivateConversation(data: PrivateConversationDTO): Promise<any>;
    createGroupConversation(data: createGroupConversationDTO): Promise<any>;
    getUserConversations(userId: string): Promise<any>;
    updateConversationLastMessage(conversationId: string, messageId: string, messageText: string, senderId: string,createdAt:string): Promise<any>;
    // getConversationMembers(conversationId: string): Promise<any>;
}