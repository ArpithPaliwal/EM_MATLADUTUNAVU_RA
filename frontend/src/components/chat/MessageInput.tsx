import { useState } from "react";
import { sendMessage } from "../../Services/socket";
import { useUploadMessageFile } from "../../hooks/useUploadMessageFile";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageResponseDto } from "../../dto/messages.dto";

type Props = { conversationId: string; senderId: string | undefined };

export default function MessageInput({ conversationId, senderId }: Props) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useUploadMessageFile();
  const queryClient = useQueryClient();

  async function send() {
    const hasText = !!text.trim();
    const hasFile = !!file;

    if (!hasText && !hasFile) return;

    let filePath: string | undefined;

    // upload file if present
    if (hasFile) {
      const res = await uploadMutation.mutateAsync(file);
      filePath = res?.filePath;
    }

    // build payload
    const payload = {
      conversationId,
      senderId,
      text: text.trim(),
      filePath,
    };

    // send to server — rely on ACK to get the real saved message
    sendMessage(
      payload,
      (savedMsg: MessageResponseDto) => {
        // update cache immediately (dedupe guard)
        queryClient.setQueryData<MessageResponseDto[]>(
          ["messages", conversationId],
          (old = []) => {
            if (old.some((m) => m._id === savedMsg._id)) return old;
            return [...old, savedMsg];
          }
        );

        setText("");
        setFile(null);
      },
      (err) => {
        console.error("Message send failed:", err);
      }
    );
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <input
        type="file"
        accept="image/*,video/*"
        name="userUploadedMediaFile"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <input
        className="flex-1 border rounded-xl px-3 py-2"
        placeholder="Type a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />

      <button
        className="bg-secondary text-white px-4 py-2 rounded-xl"
        onClick={send}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? "Uploading…" : "Send"}
      </button>
    </div>
  );
}
