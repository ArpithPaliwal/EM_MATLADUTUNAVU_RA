import { useState } from "react";
import { sendMessage } from "../../Services/socket";
import { useUploadMessageFile } from "../../hooks/useUploadMessageFile";

type Props = { conversationId: string; senderId: string | undefined};

export default function MessageInput({ conversationId, senderId }: Props) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useUploadMessageFile();

  async function send() {
    const hasText = !!text.trim();
    const hasFile = !!file;

    if (!hasText && !hasFile) return;

    let filePath: string | undefined;

    if (hasFile) {
      const res = await uploadMutation.mutateAsync(file);
      filePath = res?.filePath;
    }
    console.log("details",{
       conversationId,
        senderId,
        text: text.trim(),
        filePath,
    });
    
    sendMessage(
      {
        conversationId,
        senderId,
        text: text.trim(),
        filePath,
      },
      () => {
        // success callback
        setText("");
        setFile(null);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <input
        type="file"
        accept="image/*,video/*"
        name="userUploadedMediaFile"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />

      <input
        className="flex-1 border rounded-xl px-3 py-2"
        placeholder="Type a message…"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && send()}
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
