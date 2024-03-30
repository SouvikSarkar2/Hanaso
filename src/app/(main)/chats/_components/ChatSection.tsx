"use client";

import { Cross, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserIdStore } from "~/store";
import { api } from "~/trpc/react";
import ChatFriendCard from "./ChatFriendCard";
import Chat from "./Chat";
import { Input } from "~/components/ui/input";
import { socket } from "~/socket";

const ChatSection = () => {
  const [isInfoClicked, setIsInfoClicked] = useState<boolean>(false);
  const [isMembersClicked, setIsMembersClicked] = useState<boolean>(false);
  const [selectedFriend, setSelectedFriend] = useState<string>("0");
  const { userId } = useUserIdStore();
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  if (!userId) {
    return <div>UserUndefined</div>;
  }
  const user = api.user.find.useQuery({ id: userId });
  if (user.isLoading) {
    return <div>Loading...</div>;
  }
  if (!user.data) {
    return <div>Error Getting user Data</div>;
  }
  const friends = user.data.friends;

  return (
    <div
      className={`flex h-full w-full overflow-hidden ${isMembersClicked || isInfoClicked ? "gap-2" : ""} bg-black dark:bg-[#FFFAE6]`}
    >
      <div className="flex h-full w-full justify-start gap-4 rounded-3xl bg-white px-6 pb-2 pt-6 duration-500 dark:bg-[#202022] ">
        <div>
          <Input
            className="mb-4 rounded-[5px] border-2 border-black"
            placeholder="Search"
          />
          <div className="flex h-full w-[250px] flex-col items-start justify-start gap-2 ">
            {friends.map((id) => (
              <div
                key={id}
                onClick={() => setSelectedFriend(id)}
                className={`cursor-pointer  ${id === selectedFriend ? " rounded-[5px] bg-[#00000041]" : ""}`}
              >
                <ChatFriendCard id={id} />
              </div>
            ))}
          </div>
        </div>
        {selectedFriend === "0" ? (
          <div className="flex h-full w-full items-center justify-center font-semibold uppercase text-gray-500">
            Start By Clicking A Friend
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
