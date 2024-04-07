"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { socket } from "~/socket";
import { api } from "~/trpc/react";
import type { Message } from "~/utils/Types";

const ChatFriendCard = ({
  id,
  userId,
  conversationId,
}: {
  id: string;
  userId: string;
  conversationId: string;
}) => {
  const [lastMessage, setLastMessage] = useState<string>("");
  const data = api.user.find.useQuery({ id: id });

  const getLastMessage = api.conversation.findLastMessage.useQuery({
    conversationId,
  });

  useEffect(() => {
    socket.on("receiveLastMessage", (data: Message) => {
      if (data.senderId === id || data.senderId === userId) {
        setLastMessage(data.content);
      }
    });
    return () => {
      socket.off("receiveLastMessage");
    };
  }, [id, userId]);

  useEffect(() => {
    if (getLastMessage.data) {
      setLastMessage(getLastMessage.data.content);
    }
  }, [getLastMessage.data]);
  if (getLastMessage.isLoading) {
    return <div>Loading..</div>;
  }

  if (data.isLoading) {
    return <div>Loading...</div>;
  }
  if (!data.data) {
    return <div> Friend Doesnt Exist</div>;
  }
  const friend = data.data;

  return (
    <div className="flex h-[68px] w-[250px] rounded-lg ">
      <div className=" flex h-full w-[28%] p-2">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <Image src={friend.image} fill alt="" />
        </div>
      </div>
      <div className="flex h-full w-[70%] flex-col p-2 font-medium">
        <div className="h-[50%] w-full ">
          <div className="text-md font-urbanist font-bold">{friend.name}</div>
        </div>
        <div className="h-50% w-full text-sm text-slate-500">{lastMessage}</div>
      </div>
    </div>
  );
};

export default ChatFriendCard;
