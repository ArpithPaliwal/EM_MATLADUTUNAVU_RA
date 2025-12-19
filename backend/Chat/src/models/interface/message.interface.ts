import { Types } from "mongoose";
export type MessageSeenStatus = "delivered" | "read";
export interface IMessage {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;

    text: string;
    messageSeenStatus: MessageSeenStatus;
    createdAt: Date;
    updatedAt: Date;
}
