import { io, Socket } from "socket.io-client";
import type { MessageResponseDto } from "../dto/messages.dto";

export const socket: Socket = io(import.meta.env.VITE_SOCKET_URL as string, {
  withCredentials: true,
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export const joinConversations = (conversationIds:string[])=>{
  if(socket.connected){
    socket.emit("conversation:join",conversationIds)
  }
}

export const activeConversation = (conversationId:string)=>{
  if(socket.connected){
    socket.emit("conversation:active",conversationId)
  }
}

export const inActiveConversation = (conversationId:string)=>{
  if(socket.connected){
    socket.emit("conversation:inactive",conversationId)
  }
}




export const onMessageNew = (cb: (msg: MessageResponseDto) => void) => {
  socket.on("message:new", cb);

  
  return () => socket.off("message:new", cb);
};

export const onMessageDeleted = (cb: (payload: { messageId: string }) => void) => {
  socket.on("message:deleted", cb);

  return () => socket.off("message:deleted", cb);
};




// socket.emit("message:send", payload<SendMessageDto>, (res: any) => {
//   if (!res?.ok) {
//     console.error("Message failed:", res?.error);
    
    
//     return;
//   }

//   console.log("Delivered:", res.message);
// });