export interface IMessageRepository {
    createMessage(conversationId: string, senderId: string, text?: string , imageUrl?: string , videoUrl?: string, imagePublicId?: string, videoPublicId?: string): Promise<any>;
}