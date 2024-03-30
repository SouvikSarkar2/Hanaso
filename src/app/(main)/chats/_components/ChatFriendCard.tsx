"use client";

import Image from "next/image";
import { api } from "~/trpc/react";

const ChatFriendCard = ({ id }: { id: string }) => {
  const data = api.user.find.useQuery({ id: id });
  if (data.isLoading) {
    return <div>Loading...</div>;
  }
  if (!data.data) {
    return <div> Friend Doesnt Exist</div>;
  }
  const friend = data.data;
  console.log(friend);
  return (
    <div className="flex h-[68px] w-[250px] rounded-lg ">
      <div className=" flex h-full w-[28%] p-2">
        <div className="relative h-full w-full overflow-hidden rounded-[5px]">
          <Image src={friend.image} fill alt="" />
        </div>
      </div>
      <div className="flex h-full w-[70%] flex-col p-2 font-medium">
        <div className="h-[50%] w-full">
          <div className="text-sm">{friend.name}</div>
        </div>
        <div className="h-50% w-full"></div>
      </div>
    </div>
  );
};

export default ChatFriendCard;
