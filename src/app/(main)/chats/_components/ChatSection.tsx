"use client";

import { Cross, Ellipsis, MessageCircleDashed, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserIdStore } from "~/store";
import { api } from "~/trpc/react";
import ChatFriendCard from "./ChatFriendCard";
import Chat from "./Chat";
import { Input } from "~/components/ui/input";
import { socket } from "~/socket";
import Toaster from "./Toaster";
import { useRouter, useSearchParams } from "next/navigation";
import ChatFriendUtil from "./ChatFriendUtil";

const ChatSection = ({ userId }: { userId: string }) => {
  const searchParams = useSearchParams();
  const Router = useRouter();
  const chatId = searchParams.get("q");
  const [isInfoClicked, setIsInfoClicked] = useState<boolean>(false);
  const [isMembersClicked, setIsMembersClicked] = useState<boolean>(false);
  const [selectedFriend, setSelectedFriend] = useState<string>(chatId ?? "0");
  const { data, isLoading, refetch } = api.user.find.useQuery({ id: userId });

  useEffect(() => {
    socket.on("friendChanges", async () => {
      await refetch();
    });
  }, [refetch]);

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
      <Toaster id={selectedFriend} />
      <div className="flex h-full w-full justify-start  rounded-xl bg-white px-6 pb-2 pt-6 duration-500 dark:bg-[#202022]">
        <div className="">
          <div className="flex h-[12%] w-full items-center justify-between border-b-2 border-r-2 border-black  p-1 px-2">
            <div className="font-urbanist text-xl font-bold">Messages (14)</div>
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
          <Chat id={selectedFriend} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        {isInfoClicked && (
          <div className="flex h-full min-w-[320px] flex-col justify-start rounded-3xl bg-white duration-500 dark:bg-[#202022] ">
            <div className="flex w-full justify-end p-2 ">
              <div onClick={() => setIsInfoClicked(false)}>
                <X />
              </div>
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
