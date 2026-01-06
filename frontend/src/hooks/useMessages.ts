import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../API/messagesApi";
export function useMessages(conversationId: string) {
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => getMessages(conversationId),
        staleTime: 60_000,          // 1 minute
        refetchOnWindowFocus: false,
    })
}