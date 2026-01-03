import type { IMessageService } from "./interfaces/message.service.interface.js";
import type { IMessageRepository } from "../repositories/interfaces/message.repository.interface.js";
import { MessageRepository } from "../repositories/message.repository.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { emitMessageEvents } from "../sockets/events/message.events.js";
import  {getIO}  from "../sockets/socket.server.js";
import type { IConversationService } from "./interfaces/conversation.service.interface.js";
import { ConversationService } from "./conversation.service.js";
export class MessageService implements IMessageService {
    constructor(private messageRepository: IMessageRepository = new MessageRepository(),private conversationService:IConversationService = new ConversationService()) { }
    async createMessage(conversationId: string, senderId: string, text: string, imageOrVideoPath?: string): Promise<any> {
        // Implementation for creating a message
        if (!senderId || !conversationId) {
            throw new Error("Invalid sender or conversation");
        }
        if (!text && !imageOrVideoPath) {
            throw new Error("Message content cannot be empty");
        }
        
        const messageData: any = {
            conversationId,
            senderId,
            text
        };

        if (imageOrVideoPath) {
            const cloudinaryData = await uploadOnCloudinary(imageOrVideoPath);

            if (cloudinaryData?.resource_type === "image") {
                messageData.imageUrl = cloudinaryData.secure_url;
                messageData.imagePublicId = cloudinaryData.public_id;
            }

            if (cloudinaryData?.resource_type === "video") {
                messageData.videoUrl = cloudinaryData.secure_url;
                messageData.videoPublicId = cloudinaryData.public_id;
            }
        }
        const message = await this.messageRepository.createMessage(messageData.conversationId, messageData.senderId, messageData.text, messageData.imageUrl, messageData.videoUrl, messageData.imagePublicId, messageData.videoPublicId);
        await this.conversationService.updateConversationLastMessage(conversationId, message._id, text, senderId, message.createdAt);
        const io = getIO();
        emitMessageEvents(io, message);
        return message;
    }
    async getMessages(conversationId: string, userId: string): Promise<any> {
        // Implementation for retrieving messages
        if (!conversationId || !userId) {
            throw new Error("Invalid conversation or user");
        }
        const messages = await this.messageRepository.getMessages(conversationId, userId);
        return messages;
    }
}