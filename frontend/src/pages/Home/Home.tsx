import ChatList from "../../components/chat/ChatList";
import { useState } from "react";
import { useSelector } from "react-redux";
import ConversationHeader from "../../components/chat/ConversationHeader";

type UserData = {
  avatar: string;
};

type AuthState = {
  userData: UserData | null;
  isLoggedIn: boolean;
};

type AppState = {
  auth: AuthState;
};

function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { userData } = useSelector((state: AppState) => state.auth);
  console.log(userData);

  return (
    <div className="px-3  overflow-hidden ">
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
      <div className="border-3 border-blue-300 rounded-2xl p-2 flex flex-col ">
        <div>
          <div>
            <ConversationHeader/>
          </div>
          <div className="h-[80vh] w-full max-w-80 border-r border-gray-300 dark:border-gray-600 overflow-y-auto pr-2 flex-1">
            <ChatList
              selectedChatId={selectedChatId}
              onSelect={setSelectedChatId}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Home;
