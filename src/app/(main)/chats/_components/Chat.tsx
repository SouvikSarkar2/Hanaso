import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Input } from "~/components/ui/input";
import { socket } from "~/socket";
import { useUserIdStore } from "~/store";
import { api } from "~/trpc/react";
import Chat2 from "./Chat2";
import { Skeleton } from "~/components/ui/skeleton";

const Chat = ({
  id,
  setIsInfoClicked,
  isInfoClicked,
}: {
  id: string;
  isInfoClicked: boolean;
  setIsInfoClicked: Dispatch<SetStateAction<boolean>>;
}) => {
  const { userId, userName } = useUserIdStore();

  const data = api.user.find.useQuery({ id });
  if (!userId || !userName) {
    return <div>No User Found</div>;
  }

  const conversationData = api.conversation.find.useQuery({
    Id1: id,
    Id2: userId,
  });
  if (conversationData.isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Skeleton className="h-[95%] w-[98%] rounded-xl"></Skeleton>
      </div>
    );
  }
  if (!conversationData.data) {
    return (
      <div className="flex h-full w-full items-center justify-center font-semibold text-red-500">
        No Conversation Data Found
      </div>
    );
  }
  const roomId = conversationData.data.id;

  if (data.isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-start ">
        <div className="flex h-[12%] w-full items-center justify-between border-b-2 border-b-black">
          <div className="relative h-[88px] w-[88px] p-3">
            <Skeleton className="relative h-full w-full overflow-hidden rounded-full"></Skeleton>
          </div>
          <div className="flex h-full w-[71%] flex-col justify-evenly">
            <Skeleton className="flex h-[40%] w-[40%]  rounded-xl "></Skeleton>
            <Skeleton className="h-[30%] w-[30%] rounded-xl"></Skeleton>
          </div>
          <div className="flex h-full w-[20%] items-center justify-end">
            <Skeleton className="h-[60%] w-[70%] rounded-xl"></Skeleton>
          </div>
        </div>
        <div className="flex h-[78%] w-full items-center justify-center">
          <Skeleton className="h-[95%] w-[98%] rounded-xl"></Skeleton>
        </div>
        <div className="flex h-[10%] w-full items-center justify-center ">
          <Skeleton className=" h-[65%] w-[95%] rounded-xl"></Skeleton>
        </div>
      </div>
    );
  }

  if (!data.data) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        Friend Not Found
      </div>
    );
  }
  const friend = data.data;
  const name = friend.name;
  const img = friend.image;

  return (
    <Chat2
      roomId={roomId}
      senderName={userName}
      name={name}
      senderId={userId}
      recipientId={id}
      img={img}
      isInfoClicked={isInfoClicked}
      setIsInfoClicked={setIsInfoClicked}
    />
  );
};

export default Chat;
