import { api } from "~/trpc/react";
import ChatFriendCard from "./ChatFriendCard";
import { Skeleton } from "~/components/ui/skeleton";

const ChatFriendUtil = ({ id, userId }: { id: string; userId: string }) => {
  const { isLoading, data } = api.conversation.find.useQuery({
    Id1: id,
    Id2: userId,
  });
  if (isLoading) {
    return <Skeleton className=" h-[68px] w-[250px] rounded-xl "></Skeleton>;
  }
  if (!data) {
    return (
      <div className="flex h-[68px] w-[250px] items-center justify-center rounded-xl bg-red-100 font-semibold text-red-500">
        No Conversation Data Found
      </div>
    );
  }
  const conversationId = data.id;
  return (
    <ChatFriendCard id={id} conversationId={conversationId} userId={userId} />
  );
};

export default ChatFriendUtil;
