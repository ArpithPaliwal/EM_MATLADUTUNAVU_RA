import {  useEffect } from "react";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "../Services/socket";

type AuthState = {
  userData: object | null;
  isLoggedIn: boolean;
};

type AppState = {
  auth: AuthState;
};

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      connectSocket();
      console.log(" socket connected");
    } else {
      disconnectSocket();
      console.log(" socket disconnected");
    }

    return () => disconnectSocket();
  }, [isLoggedIn]);

  return <>{children}</>;
}
