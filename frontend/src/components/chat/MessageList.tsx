import { useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages";
import { useSelector } from "react-redux";
import {
  onMessageNew,
  onMessageDeleted,
  activeConversation,
  inActiveConversation,
  socket,
} from "../../Services/socket";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageResponseDto } from "../../dto/messages.dto";

type Props = {
  conversationId: string;
};

type UserData = {
  _id: string;
};

type AuthState = {
  userData: UserData | null;
  isLoggedIn: boolean;
};

type AppState = {
  auth: AuthState;
};

export default function MessageList({ conversationId }: Props) {
  const { data, isLoading, isError } = useMessages(conversationId);
  const { userData } = useSelector((state: AppState) => state.auth);
  const queryClient = useQueryClient();
  const latestReadIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!conversationId) return;

    // ✅ only emit if socket is connected
    activeConversation(conversationId);

    const offNew = onMessageNew((msg) => {
      if (msg.senderId === userData?._id) return;

      queryClient.setQueryData<MessageResponseDto[]>(
        ["messages", conversationId],
        (old = []) => {
          if (old.some((m) => m._id === msg._id)) return old;
          return [...old, msg];
        }
      );
      latestReadIdRef.current = msg._id;
    });

    const offDeleted = onMessageDeleted(({ messageId }) => {
      queryClient.setQueryData<MessageResponseDto[]>(
        ["messages", conversationId],
        (old = []) => old.filter((m) => m._id !== messageId)
      );
    });

    return () => {
      inActiveConversation(conversationId);

      offNew();
      offDeleted();
    };
  }, [conversationId, queryClient, userData]);
  useEffect(() => {
    if (!data || data.length === 0) return;

    const lastMessageId = data[data.length - 1]._id;

    latestReadIdRef.current = lastMessageId;

    socket.emit("conversation:read", {
      conversationId,
      lastReadMessageId: lastMessageId,
    });
  }, [conversationId, data]);

  useEffect(() => {
    if (!conversationId) return;

    const interval = setInterval(() => {
      if (!latestReadIdRef.current) return;

      socket.emit("conversation:read", {
        conversationId,
        lastReadMessageId: latestReadIdRef.current,
      });
    }, 3000); // ✅ 3-second heartbeat

    return () => clearInterval(interval);
  }, [conversationId]);
  if (isLoading) return <div className="p-4 text-sm">Loading messages…</div>;

  if (isError)
    return (
      <div className="p-4 text-sm text-red-500">Failed to load messages.</div>
    );

  if (!data || data.length === 0)
    return (
      <div className="p-4 text-sm text-gray-500">
        No messages yet. Start the conversation.
      </div>
    );
  {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-2 p-3 overflow-y-auto  ">
      {data?.map((msg) => {
        const isMine = msg.senderId === userData?._id;

        return (
          <div
            key={msg?._id}
            className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
              isMine
                ? "self-end bg-secondary text-white"
                : "self-start bg-gray-200 text-gray-900"
            }`}
          >
            {msg.text && <p>{msg.text}</p>}

            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="attachment"
                className="mt-1 rounded-md max-h-60 object-cover"
              />
            )}

            {msg.videoUrl && (
              <video
                src={msg.videoUrl}
                controls
                className="mt-1 rounded-md max-h-60"
              />
            )}

            <div className="mt-1 text-xs opacity-70">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
