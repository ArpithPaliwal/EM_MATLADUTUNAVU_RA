import type { RequestHandler } from 'express';
export interface IMessageControllerInterface {
    sendMessage: RequestHandler;
    getMessages: RequestHandler;
    uploadFile:RequestHandler;
}
