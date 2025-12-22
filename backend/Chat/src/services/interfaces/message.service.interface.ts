export interface IMessageService {
    createMessage(conversationId: string, senderId: string, content: string): Promise<any>;
}