import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import type { IMessageControllerInterface } from "./interfaces/message.contoller.interface.js";
import type { IMessageService } from "../services/interfaces/message.service.interface.js";
import { MessageService } from "../services/message.service.js";



export class MessageController implements IMessageControllerInterface {
    constructor(private messageService: IMessageService = new MessageService()) { }
    sendMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        
        const { conversationId, text } = req.body;
        const senderId = req.user?._id;
        
        console.log("Received message data:", { conversationId, text, senderId });
        const ImageOrVideoPath = req.file?.path || "";
        if (!conversationId || !senderId || (!text && !ImageOrVideoPath)) {
            res.status(400).json(
                new ApiResponse(400, null, "Missing required fields")
            );
            return;
        }
        const message = await this.messageService.createMessage(conversationId, senderId, text || "",ImageOrVideoPath);

        res.status(201).json(
            new ApiResponse(201, message, "Message sent successfully")
        );
    }
    )
    getMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { conversationId } = req.params;

    }
    )

}

