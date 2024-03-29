"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const deleteFriend = api.friend.deleteFriend.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  if (deleteFriend.isPending) {
    return <div>Removing Friend...</div>;
  }

  return (
    <div className=" flex h-[70px] w-[300px] overflow-hidden rounded-xl bg-[#00000021] dark:bg-[#FFFAE621]">
      <div className="h-full w-[24%] p-2">
        <div className="relative h-full w-full overflow-hidden rounded-full ">
          <Image src={img} alt="" fill />
        </div>
      </div>
      <div className="flex h-full w-[55%] pl-2 pt-2 font-medium">{name}</div>
      <div className="flex h-full w-[20%] items-center justify-center">
        <div
          className=" cursor-pointer hover:text-red-500"
          onClick={() => deleteFriend.mutate({ Id1: id, Id2: currUserId })}
        >
          <X />
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
