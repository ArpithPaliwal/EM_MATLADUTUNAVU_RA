export interface IMessageService {
    createMessage(conversationId: string, senderId: string, text: string, imageOrVideoPath?: string,): Promise<any>;
    getMessages(conversationId: string, userId: string): Promise<any>;
}