import { io, Socket } from "socket.io-client";

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