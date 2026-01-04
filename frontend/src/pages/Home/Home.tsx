import { useConversations } from "../../hooks/useConversationList"

function Home() {
  const { data: conversations, isLoading ,error} = useConversations();

  return (
    <div>
      <div>
        Home Page
      </div>
      <div>
        <div>chatlist</div>
        <div>chat</div>
      </div>
    </div>
  )
}

export default Home
