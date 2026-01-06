import { io, Socket } from "socket.io-client";
import type { MessageResponseDto } from "../dto/messages.dto";



export const socket: Socket = io(import.meta.env.VITE_API_BASE_CHAT_SOCKET as string, {
  withCredentials: true,
  autoConnect: true,
  auth: {
    token: localStorage.getItem("accessToken")
  }
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
  console.log("SOCKET CONNECTED:", socket.id);
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




// socket.emit("message:send", payload, (res: any) => {
//   if (!res?.ok) {
//     console.error("Message failed:", res?.error);
    
    
//     return;
//   }

//   console.log("Delivered:", res.message);
// });
export const sendMessage = (
  payload: unknown,
  cb?: (message: unknown) => void,
  onError?: (err: unknown) => void
) => {
  socket.emit("message:send", payload, (res:any) => {
    console.log("SERVER RECEIVED message:send");
    if (!res?.ok) {
      console.error("Message failed:", res?.error);
      onError?.(res?.error);
      return;
    }

    cb?.(res.message);
  });
};
