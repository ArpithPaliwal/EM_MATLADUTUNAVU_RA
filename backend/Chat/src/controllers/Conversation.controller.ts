import type {Request , Response} from "express";
import type { IConversationController } from "./interfaces/conversation.controller.interface.js";
import type { IConversationService } from "../services/interfaces/conversation.service.interface.js";
import { ConversationService } from "../services/conversation.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export class ConversationController implements IConversationController {
  constructor(private conversationService: IConversationService = new ConversationService()) {}

  createPrivateConversation = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { memberId } = req.body;
    const userId = req.user?._id
    console.log("USER ID FROM REQ.USER:", userId);
    const conversation = await this.conversationService.createPrivateConversation({ memberId, userId ,createdBy:userId});
    return res.status(201).json(new ApiResponse(201, conversation, "Private conversation created successfully"));
  })
  
  createGroupConversation = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { groupName, memberIds, createdBy } = req.body;
    const avatarLocalPath = req.file?.path;
    const conversation = await this.conversationService.createGroupConversation({ groupName, memberIds, createdBy, avatarLocalPath });
    return res.status(201).json(new ApiResponse(201, conversation, "Group conversation created successfully"));
  })

  getUserConversations = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id;
    const conversations = await this.conversationService.getUserConversations(userId);
    console.log(conversations);
    
    return res.status(200).json(new ApiResponse(200, conversations, "User conversations retrieved successfully"));
  })
}