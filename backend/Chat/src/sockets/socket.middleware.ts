import { Socket } from "socket.io";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const req = socket.request as any;

  const res = {
    status: () => ({
      json: () => {},
    }),
  };

  verifyJWT(req, res as any, (err?: any) => {
    if (err) {
      return next(new Error("Unauthorized socket connection"));
    }

    const user = req.user;

    if (!user?._id) {
      return next(new Error("Unauthorized socket connection"));
    }

    socket.data.userId = user._id.toString();
    socket.data.activeConversations = new Set<string>();

    next(); 
  });
};
