import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import type { IMessageRepository } from "../repositories/interfaces/message.repository.interface.js";
import { Conversation } from "../models/conversation.model.js";
export class MessageRepository implements IMessageRepository {
    async createMessage(conversationId: string, senderId: string, text: string, imageUrl?: string, videoUrl?: string, imagePublicId?: string, videoPublicId?: string): Promise<any> {
       
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

        return await Message.create(messageData);
    }
    async getMessages(conversationId: string, userId: string): Promise<any> {
      
        const convo = await Conversation.findOne({
            _id: new mongoose.Types.ObjectId(conversationId),
            members: new mongoose.Types.ObjectId(userId)
        });

        if (!convo) {
           
            return [];  
        }

      
        const messages = await Message.aggregate([
            {
                $match: {
                    conversationId: new mongoose.Types.ObjectId(conversationId)
                }
            },
            { $sort: { createdAt: 1 } }
        ]);

        return messages;
    }


}

