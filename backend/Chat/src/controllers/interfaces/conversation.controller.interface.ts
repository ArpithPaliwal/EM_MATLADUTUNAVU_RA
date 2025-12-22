import type { RequestHandler } from 'express';

export interface IConversationController {
  createPrivateConversation: RequestHandler;
  createGroupConversation: RequestHandler;
}