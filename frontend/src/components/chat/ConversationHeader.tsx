import { useState } from "react";
// type ConversationHeaderProps = {
//   title: string;
// };

export default function ConversationHeader() {
    const [value,setValue] = useState<string>("")
    
  return (
    <div className="font-semibold text-lg">
      <input 
      value={value}
      onChange={(e)=>setValue(e.target.value)}
      className="border-2 border-blue-200 rounded-xl"
      />
     
      
    </div>
  );
}
