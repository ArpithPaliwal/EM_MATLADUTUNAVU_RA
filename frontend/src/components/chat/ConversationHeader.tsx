import type { ConversationListResponseDto } from "../../dto/chatListResponse.dto";
import { getConversationDisplay } from "../../utils/conversationDisplay";

type Props = {
  conversation: ConversationListResponseDto;
};

export default function ConversationHeader({ conversation }: Props) {
  const { name, avatar } = getConversationDisplay(conversation);

  
    

  return (
    <div className="flex items-center gap-3 h-16 px-4 rounded-xl bg-third w-[88vw] sm:w-full">
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />

      
        <span className="font-semibold text-gray-900">{name}</span>
      
      

      
      
    </div>
  );
}
