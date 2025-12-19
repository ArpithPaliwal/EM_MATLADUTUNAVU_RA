// message.model.ts
import mongoose, { Schema, Model } from "mongoose";
import type { IMessage } from "./interface/message.interface.js";

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message: Model<IMessage> =
  mongoose.model<IMessage>("Message", messageSchema);
