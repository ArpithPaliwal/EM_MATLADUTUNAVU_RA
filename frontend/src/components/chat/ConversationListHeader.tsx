import { UserPlus, CirclePlus } from "../../assets/icons/index";
import { useState } from "react";
import { useCreatePrivateConversation } from "../../hooks/useNewPrivateConversation";

export default function ConversationListHeader() {
  const [value, setValue] = useState<string>("");

  const { mutate: createPrivate, isPending: isPrivatePending } =
    useCreatePrivateConversation();

  // const {
  //   mutate: createGroup,
  //   isPending: isGroupPending,
  // } = useCreateGroupConversation();


  const handlePrivateCreate = () => {
    if (!value.trim()) return;
    createPrivate({ memberUsername: value });
  };

  // const handleGroupCreate = () => {
  //   if (!value.trim()) return;
  //   createGroup({ memberId: value });
  // };

  return (
    <div className="font-semibold text-lg mb-3 flex gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border-2 border-blue-200 rounded-xl px-2"
        placeholder="Enter Member ID"
      />
      <div>
        <button
          className="bg-secondary rounded-full p-1 disabled:opacity-50"
          onClick={() => handlePrivateCreate()}
          disabled={isPrivatePending}
        >
          <UserPlus color="white" />
        </button>
      </div>
      <div>
        <button
          className="bg-secondary rounded-full p-1 disabled:opacity-50"
          // onClick={() => mutate()}
          // disabled={isPrivatePending || !value}
        >
          <CirclePlus color="white" />
        </button>
      </div>
    </div>
  );
}
