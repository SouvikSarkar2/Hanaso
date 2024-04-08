"use client";

import { MessageSquareText, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
      toast.success("Friend Removed");
      socket.emit("friendChanged", currUserId);
    },
  });

  if (deleteFriend.isPending) {
    return <div>Removing Friend...</div>;
  }

  return (
    <div className=" relative flex h-[120px]  w-[150px] overflow-hidden rounded-xl ">
      <div className="absolute left-0 top-0 h-full w-full duration-500 hover:scale-150 hover:blur-sm">
        <Image src={img} alt="" fill />
      </div>

      <div className="absolute left-2 top-2 z-10 flex font-urbanist text-xl font-bold">
        <div className=" text-md z-20 cursor-default rounded-[10px] bg-inherit px-1 text-[16px]  text-black blur-0 duration-500 hover:bg-white">
          {name}
        </div>
      </div>
      <div className="absolute bottom-1 right-2 z-10 flex h-[20%] w-full items-center justify-end gap-2">
        <div
          onClick={() => Router.push(`/chats?q=${id}`)}
          className=" cursor-pointer rounded-[5px] bg-[#E6CA62] px-2 font-urbanist font-bold text-black duration-300 hover:scale-110"
        >
          <MessageSquareText size={18} />
        </div>
        <div
          className=" cursor-pointer rounded-[5px] bg-red-500 px-2 font-urbanist font-bold text-black duration-300 hover:scale-110"
          onClick={() => deleteFriend.mutate({ Id1: id, Id2: currUserId })}
        >
          <Trash2 size={18} />
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
