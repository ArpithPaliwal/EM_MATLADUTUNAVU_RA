import mongoose from "mongoose";
import { UserClient } from "../clients/user.client.js";
import type { PrivateConversationDTO, createGroupConversationDTO } from "../dtos/createPrivateConversation.dto.js";
import { ConversationRepository } from "../repositories/conversation.repository.js";
import type { IConversationRepository } from "../repositories/interfaces/conversation.repository.interface.js";
import type { IConversationService } from "./interfaces/conversation.service.interface.js";
import type { IConversationParticipantService } from "./interfaces/createConversationParticipant.service.interface.js";
import { ConversationParticipantService } from "./conversationParticipant.service.js";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/apiError.js";

const tempFolder = path.resolve("public", "temp");

export class ConversationService implements IConversationService {
    constructor(private conversationrepository: IConversationRepository = new ConversationRepository(),
        private userClient: UserClient = new UserClient(),
        private conversationParticipantService: IConversationParticipantService = new ConversationParticipantService()
    ) { }

    async createPrivateConversation(data: PrivateConversationDTO): Promise<any> {
        const { userId, memberId } = data;
        const memberExists = await this.userClient.checkUserExists(data.memberId);
        if (!memberExists) {
            throw new Error("user does not exist");
        }
        const conversationExists = await this.conversationrepository.checkExistingPrivateConversation(data);
        if (conversationExists) {
            throw new Error("conversation already exists");
        }
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const conversation = await this.conversationrepository.createPrivateConversation(data,session);

            await this.conversationParticipantService.createConversationParticipants({ userIds: [userId, memberId], conversationId: conversation._id },session);

            await session.commitTransaction();
            
            return conversation;
        } catch (error) {
            await session.abortTransaction();
            
            throw error;
        }
        finally {
            session.endSession();
        }




    }
    async createGroupConversation(data: createGroupConversationDTO): Promise<any> {
        const {groupName, memberIds, createdBy , avatar} = data;
        const session = await mongoose.startSession();
        try {
            
            session.startTransaction();
            const conversation = await this.conversationrepository.createGroupConversation(data,session);
            await this.conversationParticipantService.createConversationParticipants({ userIds: memberIds, conversationId: conversation._id },session);

            await session.commitTransaction();
            
            return conversation;
        } catch (error) {
            
            await session.abortTransaction();
            
            try {
                if (fs.existsSync(tempFolder)) {
                    const files = fs.readdirSync(tempFolder);
                    files.forEach((file) => {
                        const filePath = path.join(tempFolder, file);
                        fs.unlinkSync(filePath);
                        console.log('Deleted file:', filePath);
                    });
                    console.log('All files in temp folder deleted.');
                }
            } catch (error) {
                console.error('Error deleting files in temp folder:', error);
            }
            throw error;
        } finally {
            
            session.endSession();
        }
    }
    
}