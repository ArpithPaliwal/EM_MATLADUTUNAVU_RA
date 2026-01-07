import ChatList from "../../components/chat/ChatList";
import { useState } from "react";
import { useSelector } from "react-redux";
import ConversationListHeader from "../../components/chat/ConversationListHeader";
import type { ConversationListResponseDto } from "../../dto/chatListResponse.dto";
import ConversationArea from "../../components/chat/conversationArea";

type UserData = {
  avatar: string;
  _id: string;
};

type AuthState = {
  userData: UserData | null;
  isLoggedIn: boolean;
};

type AppState = {
  auth: AuthState;
};

function Home() {
  const [selectedChat, setSelectedChat] =
    useState<ConversationListResponseDto | null>(null);

  const { userData } = useSelector((state: AppState) => state.auth);

  return (
    <div className="px-3 h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="h-10 w-32 md:h-12 md:w-40">
          <img
            src="name_light-theme.svg"
            className="block h-full w-full object-contain"
          />
          <img
            src="name_dark-theme.svg"
            className="hidden h-full w-full object-contain"
          />
        </div>

        <div className="h-10 w-10 md:h-11 md:w-11 overflow-hidden rounded-full border border-blue-500 shadow-sm">
          <img
            className="h-full w-full object-cover"
            src={userData?.avatar}
            alt="Profile"
          />
        </div>
      </div>

      {/* Main chat layout */}
      <div className="border-3 border-blue-300 rounded-2xl p-2 flex gap-2 h-[85vh] min-h-0">
        {/* Chat list */}
        <div className="flex flex-col w-80 min-w-64">
          <ConversationListHeader />

          <div className="h-full border-r border-gray-300 dark:border-gray-600 overflow-y-auto pr-2">
            <ChatList selectedChat={selectedChat} onSelect={setSelectedChat} />
          </div>
        </div>

        {/* Conversation area */}
        <div className="flex-1 min-h-0 ">
          <ConversationArea
            conversation={selectedChat}
            userId={userData?._id}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
