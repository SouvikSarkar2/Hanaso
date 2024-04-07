import { api } from "~/trpc/react";
import ChatFriendCard from "./ChatFriendCard";

const ChatFriendUtil = ({ id, userId }: { id: string; userId: string }) => {
  const conversationData = api.conversation.find.useQuery({
    Id1: id,
    Id2: userId,
  });
  if (conversationData.isLoading) {
    return <div>Loading...</div>;
  }
  if (!conversationData.data) {
    return <div>No Conversation Data Found</div>;
  }
  const conversationId = conversationData.data.id;
  return (
    <ChatFriendCard id={id} conversationId={conversationId} userId={userId} />
  );
};

export default ChatFriendUtil;
