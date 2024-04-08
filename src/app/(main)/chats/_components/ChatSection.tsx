"use client";

import { Ellipsis, MessageCircleDashed, Search, X } from "lucide-react";

import { useEffect, useState } from "react";
import { useGlobalBadgeStore } from "~/store";
import { api } from "~/trpc/react";

import Chat from "./Chat";

import { socket } from "~/socket";

import { useRouter, useSearchParams } from "next/navigation";
import ChatFriendUtil from "./ChatFriendUtil";
import Toaster from "../../friends/_components/Toaster";
import Image from "next/image";
import FriendInfo from "./FriendInfo";

const ChatSection = ({ userId }: { userId: string }) => {
  const searchParams = useSearchParams();
  const Router = useRouter();
  const chatId = searchParams.get("q");
  const { totalBadges, resetTotalBadge } = useGlobalBadgeStore();
  const [isInfoClicked, setIsInfoClicked] = useState<boolean>(false);
  const [isMembersClicked, setIsMembersClicked] = useState<boolean>(false);
  const [selectedFriend, setSelectedFriend] = useState<string>(chatId ?? "0");
  const { data, isLoading, refetch } = api.user.find.useQuery({ id: userId });

  useEffect(() => {
    resetTotalBadge();
  }, [resetTotalBadge]);

  useEffect(() => {
    socket.on("friendChanges", async () => {
      await refetch();
    });
  }, [refetch]);

  useEffect(() => {
    if (chatId) {
      setSelectedFriend(chatId);
    }
    setIsInfoClicked(false);
  }, [chatId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>Error Getting user Data</div>;
  }
  const friends = data.friends;
  return (
    <div
      className={`flex h-full w-full overflow-hidden ${isMembersClicked || isInfoClicked ? "gap-2" : ""} bg-[#202022] dark:bg-[#FFFAE6]`}
    >
      <Toaster />
      <div className="flex h-full w-full justify-start  rounded-xl bg-white px-6 pb-2 pt-6 duration-500 dark:bg-[#202022]">
        <div className="">
          <div className="flex h-[12%] w-full items-center justify-between border-b-2 border-r-2 border-black  p-1 px-2">
            <div className="font-urbanist text-xl font-bold">
              Messages {totalBadges !== 0 && `(${totalBadges})`}
            </div>
            <div>
              <Search />
            </div>
          </div>
          <div className=" flex   h-[88%] w-[280px] flex-col items-start justify-start gap-2 border-r-2 border-r-black py-4 pl-2 ">
            <div className="flex h-[7%] w-[90%] items-center justify-between font-urbanist font-bold">
              <div>Chats</div>
              <div>
                <Ellipsis />
              </div>
            </div>
            {friends.map((id) => (
              <div
                key={id}
                onClick={() => {
                  setSelectedFriend(id);
                  Router.push(`/chats?q=${id}`);
                }}
                className={`flex  cursor-pointer items-center justify-center duration-300   ${id === selectedFriend ? " rounded-[5px] bg-[#20202221] dark:bg-[#ffffff21]" : ""}`}
              >
                <ChatFriendUtil id={id} key={id} userId={userId} />
              </div>
            ))}
          </div>
        </div>
        {selectedFriend === "0" ? (
          <div className="flex  h-full w-full items-center justify-center gap-2 font-semibold uppercase text-gray-500">
            <div className="flex gap-2">
              No Chat Selected
              <MessageCircleDashed />
            </div>
          </div>
        ) : (
          <Chat
            id={selectedFriend}
            isInfoClicked={isInfoClicked}
            setIsInfoClicked={setIsInfoClicked}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        {isInfoClicked && (
          <div className="flex h-full min-w-[320px] flex-col justify-start rounded-3xl bg-white duration-500 dark:bg-[#202022] ">
            <div className="flex w-full justify-end p-2 ">
              <div
                onClick={() => setIsInfoClicked(false)}
                className=" cursor-pointer hover:text-slate-500"
              >
                <X />
              </div>
            </div>
            <div className="flex h-full w-full flex-col items-center justify-start p-2">
              {chatId && <FriendInfo friendId={chatId} />}
            </div>
          </div>
        )}
        {isMembersClicked && (
          <div className="flex h-full min-w-[320px] flex-col rounded-3xl bg-white duration-500 dark:bg-[#202022]">
            <div className="flex w-full justify-end p-2 ">
              <div onClick={() => setIsMembersClicked(false)}>
                <X />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;
