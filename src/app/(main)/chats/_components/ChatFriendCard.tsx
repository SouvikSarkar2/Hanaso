"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { socket } from "~/socket";
import { useGlobalBadgeStore, useOnlineUserStore } from "~/store";
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
  const [badge, setBadge] = useState<number>(0);
  const { decrementTotalBadge, incrementTotalBadges } = useGlobalBadgeStore();
  const { users } = useOnlineUserStore();
  const [isUserOnline, setIsUserOnline] = useState<boolean>(false);
  const data = api.user.find.useQuery({ id: id });
  const searchParams = useSearchParams();
  const chatId = searchParams.get("q");
  const getLastMessage = api.conversation.findLastMessage.useQuery({
    conversationId,
  });

  useEffect(() => {
    if (users.includes(id)) {
      setIsUserOnline(true);
    } else {
      setIsUserOnline(false);
    }
  }, [users, id]);

  useEffect(() => {
    if (chatId === id) {
      if (badge !== 0) {
        decrementTotalBadge();
      }
      setBadge(0);
    }
  }, [chatId, id, badge, decrementTotalBadge]);
  useEffect(() => {
    socket.on("receiveLastMessage", (data: Message) => {
      if (data.senderId === id || data.senderId === userId) {
        if (chatId !== data.senderId && data.senderId !== userId) {
          if (badge === 0) {
            incrementTotalBadges();
          }
          setBadge((badge) => badge + 1);
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
  }, [id, userId, chatId, badge, incrementTotalBadges]);

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
  if (data.isLoading) {
    return (
      <div className="flex h-[68px] w-[250px] rounded-lg ">
        <div className=" relative flex h-full w-[28%] p-2">
          <Skeleton className="relative h-full w-full overflow-hidden rounded-full"></Skeleton>
        </div>
        <div className="flex h-full w-[70%] flex-col items-start justify-center gap-1 p-2 font-medium">
          <Skeleton className="h-[50%] w-full rounded-[8px]"></Skeleton>
          <Skeleton className="flex h-[30%] w-[70%] rounded-xl"></Skeleton>
        </div>
      </div>
    );
  }
  if (!data.data) {
    return <div> Friend Doesnt Exist</div>;
  }
  const friend = data.data;

  return (
    <div className="flex h-[68px] w-[250px] rounded-lg ">
      <div className=" relative flex h-full w-[28%] p-2">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <Image src={friend.image} fill alt="" />
        </div>
        {isUserOnline ? (
          <div className="absolute bottom-2 right-2 z-10 h-3 w-3 rounded-full bg-green-500"></div>
        ) : (
          <div className="absolute bottom-2 right-2 z-10 h-3 w-3 rounded-full bg-gray-500"></div>
        )}
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
        {getLastMessage.isLoading ? (
          <Skeleton className="mt-1 h-[30%] w-[70%] rounded-xl"></Skeleton>
        ) : (
          <div className="h-50% flex w-full items-center justify-between text-sm text-slate-500">
            <div>{lastMessage}</div>
            {badge !== 0 && (
              <div className="rounded-full bg-slate-800 px-1 text-xs font-bold text-white dark:bg-slate-400 dark:text-black ">
                {badge}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFriendCard;
