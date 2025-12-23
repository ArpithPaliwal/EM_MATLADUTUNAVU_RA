import { Message } from "../models/message.model.js";
import type { IMessageRepository } from "../repositories/interfaces/message.repository.interface.js";
export class MessageRepository implements IMessageRepository {
    async createMessage(conversationId: string, senderId: string, text: string, imageUrl?: string, videoUrl?: string, imagePublicId?: string, videoPublicId?: string): Promise<any> {
        // Implementation for creating a message in the repository
        const messageData: any = {
            conversationId,
            senderId,
            text
        };

        if (imageUrl) {
            messageData.imageUrl = imageUrl;
            messageData.imagePublicId = imagePublicId;
        }

        if (videoUrl) {
            messageData.videoUrl = videoUrl;
            messageData.videoPublicId = videoPublicId;
        }

        await Message.create(messageData);
    }
}