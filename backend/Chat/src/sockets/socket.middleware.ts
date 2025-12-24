 import { Socket } from "socket.io";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import cookie from "cookie"; // Run: npm install cookie @types/cookie

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const req = socket.request as any;

  // 1. Manually parse the raw cookie string
  const rawCookies = req.headers.cookie;
  if (rawCookies) {
    req.cookies = cookie.parse(rawCookies);
  } else {
    req.cookies = {};
  }

  // 2. OPTIONAL: Check headers if cookie is missing (Good for Postman)
  if (!req.cookies.accessToken && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    req.cookies.accessToken = token;
  }

  const res = {
    status: () => ({
      json: () => {},
    }),
  };

  // 3. Now verifyJWT will find the token in req.cookies
  verifyJWT(req, res as any, (err?: any) => {
    if (err) return next(new Error("Unauthorized socket connection"));
    
    const user = req.user;
    if (!user?._id) return next(new Error("Unauthorized socket connection"));

    socket.data.userId = user._id.toString();
    socket.data.activeConversations = new Set<string>();

    next();
  });
};