import { useState } from "react";
import { socket } from "../../Services/socket";

type Props = { conversationId: string };

export default function MessageInput({ conversationId }: Props) {
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;

    socket.emit("message:send", {
      conversationId,
      text,
    });

    setText("");
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <input
        className="flex-1 border rounded-xl px-3 py-2"
        placeholder="Type a message…"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && send()}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        onClick={send}
      >
        Send
      </button>
    </div>
  );
}
