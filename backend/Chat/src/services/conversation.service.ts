import mongoose from "mongoose";
import { UserClient } from "../clients/user.client.js";
import type { PrivateConversationDTO, createGroupConversationDTO } from "../dtos/createPrivateConversation.dto.js";
import { ConversationRepository } from "../repositories/conversation.repository.js";
import type { IConversationRepository } from "../repositories/interfaces/conversation.repository.interface.js";
import type { IConversationService } from "./interfaces/conversation.service.interface.js";
import type { IConversationParticipantService } from "./interfaces/ConversationParticipant.service.interface.js";
import { ConversationParticipantService } from "./conversationParticipant.service.js";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/apiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";


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
            const conversation = await this.conversationrepository.createPrivateConversation(data, session);

            await this.conversationParticipantService.createConversationParticipants({ userIds: [userId, memberId], conversationId: conversation._id }, session);

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
        const { groupName, memberIds, createdBy,avatarLocalPath} = data;
        
        if(!memberIds?.length || !groupName || !avatarLocalPath){
            throw new ApiError(400, "Group name and member ids avatar  required");
        }


        const avatarCloudinaryData = await  uploadOnCloudinary(avatarLocalPath );
            if(!avatarCloudinaryData    ){
                throw new ApiError(500, "Failed to upload avatar on Cloudinary");
            }
        
            const avatar = avatarCloudinaryData?.secure_url
        const session = await mongoose.startSession();
        try {

            session.startTransaction();
            
            const conversation = await this.conversationrepository.createGroupConversation(data, session);
            await this.conversationParticipantService.createConversationParticipants({ userIds: memberIds, conversationId: conversation._id }, session);

            await session.commitTransaction();

            return conversation;
        } catch (error) {
            await deleteFromCloudinary(avatarCloudinaryData?.public_id);
            await session.abortTransaction();

            

            throw error;
        } finally {

            session.endSession();
        }
    }

}