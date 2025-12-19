import { Types } from "mongoose";

export type ConversationType = "direct" | "group";

export interface GroupAvatar {
  url: string;
  publicId: string;
}

export interface IConversation {
  

  type: ConversationType;

  participants: Types.ObjectId[];     
  createdBy: Types.ObjectId;


  groupName?: string;
  groupAvatar?: GroupAvatar;

  lastMessageId?: Types.ObjectId;
  lastMessageText?: string;
  lastMessageSenderId?: Types.ObjectId;
  lastMessageAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
