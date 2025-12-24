import type { ClientSession } from "mongoose";
import type { createGroupConversationDTO, PrivateConversationDTO } from "../dtos/createPrivateConversation.dto.js";
import { Conversation } from "../models/conversation.model.js";
import type { IConversationRepository } from "./interfaces/conversation.repository.interface.js";

export class ConversationRepository implements IConversationRepository {
    async createPrivateConversation(data: PrivateConversationDTO,session:ClientSession): Promise<any> {
        const { userId, memberId ,createdBy} = data;
        console.log("REPO RECEIVED DATA:", data);
        const createConversation: any = {
            type: "direct",
            members: [userId, memberId],
            createdBy,
        }
        const [conversation] = await Conversation.create([createConversation], { session});
        return conversation;
    }
    async checkExistingPrivateConversation(data: PrivateConversationDTO): Promise<any> {
        const { userId, memberId } = data;
        return await Conversation.findOne({
            type: "direct",
            members: { $all: [userId, memberId], $size: 2 },
        })
    }
    async createGroupConversation(data:any,session:ClientSession): Promise<any> {
        const { groupName, memberIds, createdBy, avatarLocalPath } = data;
        
        const createConversation: any = {
            type: "group",
            groupName,
            members: memberIds,
            createdBy,
            avatar:avatarLocalPath
        }
        return await Conversation.create(createConversation, { session});
    }
    async getConversationMembers(conversationId: string): Promise<any> {
        const conversation = await Conversation.findById(conversationId).select("members");
        return conversation ? conversation.members : null;
    }
}