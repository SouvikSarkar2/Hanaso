"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { socket } from "~/socket";

import { api } from "~/trpc/react";

const FriendCard = ({
  name,
  img,
  id,
  currUserId,
}: {
  name: string;
  img: string;
  id: string;
  currUserId: string;
}) => {
  const Router = useRouter();
  const deleteFriend = api.friend.deleteFriend.useMutation({
    onSuccess: () => {
      Router.refresh();
      socket.emit("friendChanged", currUserId);
    },
  });

  if (deleteFriend.isPending) {
    return <div>Removing Friend...</div>;
  }

  return (
    <div className=" relative flex h-[200px]  w-[200px] overflow-hidden rounded-xl ">
      <div className="absolute left-0 top-0 h-full w-full duration-500 hover:scale-150 hover:blur-sm">
        <Image src={img} alt="" fill />
      </div>

      <div className="absolute left-2 top-2 z-10 flex font-urbanist text-xl font-bold">
        <div className=" text-black blur-0">{name}</div>
      </div>
      <div className="absolute bottom-1 right-2 z-10 flex h-[20%] w-full items-center justify-end gap-2">
        <div
          onClick={() => Router.push(`/chats?q=${id}`)}
          className=" cursor-pointer rounded-[5px] bg-[#E6CA62] px-2 font-urbanist font-bold text-black duration-300 hover:scale-110"
        >
          Message
        </div>
        <div
          className=" cursor-pointer rounded-[5px] bg-red-500 px-2 font-urbanist font-bold text-black duration-300 hover:scale-110"
          onClick={() => deleteFriend.mutate({ Id1: id, Id2: currUserId })}
        >
          Delete
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
