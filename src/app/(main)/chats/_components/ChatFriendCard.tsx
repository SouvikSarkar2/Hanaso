"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
  const [lastTime, setLastTime] = useState<string>("");
  const [badge, setBadge] = useState<boolean>(false);
  const data = api.user.find.useQuery({ id: id });
  const searchParams = useSearchParams();
  const chatId = searchParams.get("q");
  const getLastMessage = api.conversation.findLastMessage.useQuery({
    conversationId,
  });
  useEffect(() => {
    if (chatId === id) {
      setBadge(false);
    }
  }, [chatId, id]);
  useEffect(() => {
    socket.on("receiveLastMessage", (data: Message) => {
      if (data.senderId === id || data.senderId === userId) {
        if (chatId !== data.senderId && data.senderId !== userId) {
          setBadge(true);
        }
        setLastMessage(data.content);
        setLastTime(
          new Date(data.sentAt).getHours() +
            ":" +
            new Date(data.sentAt).getMinutes(),
        );
      }
    });
    return () => {
      socket.off("receiveLastMessage");
    };
  }, [id, userId, chatId]);

  useEffect(() => {
    if (getLastMessage.data) {
      setLastMessage(getLastMessage.data.content);
      setLastTime(
        new Date(getLastMessage.data.sentAt).getHours() +
          ":" +
          new Date(getLastMessage.data.sentAt).getMinutes(),
      );
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
          <div className=" flex  w-full items-center justify-between ">
            <div className="text-md font-urbanist font-bold dark:text-gray-200">
              {friend.name}
            </div>
            <div className="text-xs">{lastTime}</div>
          </div>
        </div>
        <div className="h-50% flex w-full items-center justify-between text-sm text-slate-500">
          <div>{lastMessage}</div>
          {badge && (
            <div className="rounded-full bg-slate-400 px-2 text-xs text-black">
              new
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatFriendCard;
