import { useEffect, useRef, useLayoutEffect } from "react";
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
import type { MessagePage, MessageResponseDto } from "../../dto/messages.dto";

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

const isMongoObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

export default function MessageList({ conversationId }: Props) {
  // 1. Refs
  const topRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const latestReadIdRef = useRef<string | null>(null);

  // 2. Data
  const { data, isLoading, isError, fetchNextPage, hasNextPage } = useMessages(conversationId);
  const { userData } = useSelector((state: AppState) => state.auth);
  const queryClient = useQueryClient();

  // 3. Flatten Messages
  const allMessages = Array.from(
    new Map(
      data?.pages
        .flatMap((p: MessagePage) => p.messages)
        .map((m) => [m._id, m])
    ).values()
  ).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  /* --------------------------------------------------
     ⚡ SCROLL RESTORATION (The Fix)
  -------------------------------------------------- */
  useLayoutEffect(() => {
    const container = containerRef.current;
    
    // Only run if we have a "previous height" captured (meaning we just fetched history)
    if (container && previousScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - previousScrollHeightRef.current;

      // Only adjust if content actually grew
      if (heightDifference > 0) {
        container.scrollTop = heightDifference;
      }
      
      // Reset immediately so normal scrolling isn't affected
      previousScrollHeightRef.current = 0;
    }
  }, [allMessages]); // 👈 Run this when the message ARRAY changes, not just 'data'


  /* --------------------------------------------------
     ⚡ OBSERVER (Trigger Fetch)
  -------------------------------------------------- */
  useEffect(() => {
    if (!topRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          
          // 📸 CAPTURE HEIGHT BEFORE FETCH
          if (containerRef.current) {
            previousScrollHeightRef.current = containerRef.current.scrollHeight;
          }

          fetchNextPage();
        }
      },
      { threshold: 0.5 } // Trigger when item is 50% visible (less aggressive than 1)
    );

    observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);


  /* --------------------------------------------------
     SOCKETS & SYNC (Existing Logic)
  -------------------------------------------------- */
  useEffect(() => {
    if (!conversationId) return;
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
      if (isMongoObjectId(msg._id)) latestReadIdRef.current = msg._id;
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
    if (!data || data?.pages?.length === 0) return;
    const lastPersisted = allMessages?.filter(m => isMongoObjectId(m._id))?.at(-1);
    if (!lastPersisted) return;
    latestReadIdRef.current = lastPersisted._id;
    socket.emit("conversation:read", { conversationId, lastReadMessageId: lastPersisted._id });
  }, [conversationId, data, allMessages]);

  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(() => {
      const id = latestReadIdRef.current;
      if (!id || !isMongoObjectId(id)) return;
      socket.emit("conversation:read", { conversationId, lastReadMessageId: id });
    }, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);


  if (isLoading) return <div className="p-4 text-sm">Loading messages…</div>;
  if (isError) return <div className="p-4 text-sm text-red-500">Failed to load messages.</div>;

  return (
    <div
      ref={containerRef}
      // 👇 IMPORTANT: overflow-anchor: none prevents browser interference
      style={{ overflowAnchor: "none" }} 
      className="flex flex-col gap-2 p-3 overflow-y-auto relative h-full"
    >
      {/* Loading Trigger at Top */}
      <div ref={topRef} className="h-4 shrink-0 w-full" />

      {allMessages.map((msg) => {
        const isMine = msg.senderId === userData?._id;
        return (
          <div
            key={msg._id}
            className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
              isMine
                ? "self-end bg-secondary text-white"
                : "self-start bg-gray-200 text-gray-900"
            }`}
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.imageUrl && (
              <img src={msg.imageUrl} alt="attachment" className="mt-1 rounded-md max-h-60 object-cover" />
            )}
            {msg.videoUrl && (
              <video src={msg.videoUrl} controls className="mt-1 rounded-md max-h-60" />
            )}
            <div className="mt-1 text-xs opacity-70 text-right">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        );
      })}
    </div>
  );
}