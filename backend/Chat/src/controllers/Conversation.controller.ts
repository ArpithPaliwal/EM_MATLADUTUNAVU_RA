import type { Request, Response } from "express";
import type { IConversationController } from "./interfaces/conversation.controller.interface.js";
import type { IConversationService } from "../services/interfaces/conversation.service.interface.js";
import { ConversationService } from "../services/conversation.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export class ConversationController implements IConversationController {
  constructor(private conversationService: IConversationService = new ConversationService()) { }

  createPrivateConversation = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { memberUsername } = req.body;
    const userId = req.user?._id
    console.log("USER ID FROM REQ.USER:", userId);
    const conversation = await this.conversationService.createPrivateConversation({ memberUsername, userId, createdBy: userId });
    return res.status(201).json(new ApiResponse(201, conversation, "Private conversation created successfully"));
  })
  // createGroupConversation = asyncHandler(async (req: Request, res: Response) => {
  //   const { groupName, memberIds } = req.body;

  //   const createdBy = req.user?._id;
  //   const avatarLocalPath = req.file?.path;


  //   const parsedMemberIds: string[] = JSON.parse(memberIds);

  //   const conversation =
  //     await this.conversationService.createGroupConversation({
  //       groupName,
  //       memberIds: parsedMemberIds,
  //       createdBy,
  //       avatarLocalPath,
  //     });

  //   return res.status(201).json(
  //     new ApiResponse(201, conversation, "Group conversation created successfully")
  //   );
  // });

  createGroupConversation = asyncHandler(async (req: Request, res: Response) => {
    const { groupName } = req.body;

    const createdBy = req.user?._id;
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) throw new ApiError(404, "no avatar found ")
    const rawMemberIds = req.body.memberIds;

    if (!rawMemberIds) {
      return res.status(400).json(new ApiResponse(400, null, "memberIds missing"));
    }

    let parsedMemberIds: string[];

    try {
      const temp = typeof rawMemberIds === "string"
        ? JSON.parse(rawMemberIds)
        : rawMemberIds;

      parsedMemberIds = Array.isArray(temp) ? temp : [temp];
      if (req.user?._id) {
        parsedMemberIds.push(req.user._id.toString());
      }
    } catch (err) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid memberIds format"));
    }

    const conversation =
      await this.conversationService.createGroupConversation({
        groupName,
        memberIds: parsedMemberIds,
        createdBy,
        avatarLocalPath,
      });
    console.log("group convo", conversation);

    return res.status(201).json(
      new ApiResponse(201, conversation, "Group conversation created successfully")
    );
  });


  getUserConversations = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id;
    const conversations = await this.conversationService.getUserConversations(userId);
    console.log(conversations);

    return res.status(200).json(new ApiResponse(200, conversations, "User conversations retrieved successfully"));
  })
}