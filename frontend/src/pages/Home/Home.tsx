import ChatList from "../../components/chat/ChatList";
import { useState } from "react";

function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  return (
    <div>
      <div>Home Page</div>
      <div>
        <div>
          <div>
            <ChatList
              selectedChatId={selectedChatId}
              onSelect={setSelectedChatId}
            />
          </div>
        </div>
        <div>chat</div>
      </div>
    </div>
  );
}

export default Home;
