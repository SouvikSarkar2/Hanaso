"use client";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { socket } from "~/socket";
import { api } from "~/trpc/react";

const RequestCard = ({
  name,
  img,
  senderId,
  receiverId,
}: {
  name: string;
  img: string;
  senderId: string;
  receiverId: string;
}) => {
  const router = useRouter();
  const acceptRequest = api.friend.acceptRequest.useMutation({
    onSuccess: () => {
      router.refresh();
      socket.emit("friendChanged", senderId);
    },
  });

  const rejectRequest = api.friend.rejectRequest.useMutation({
    onSuccess: () => {
      router.refresh();
      socket.emit("friendChanged", senderId);
    },
  });

  if (acceptRequest.isPending) {
    return <div>Accepting request...</div>;
  }

  if (rejectRequest.isPending) {
    return <div>Rejecting request...</div>;
  }

  return (
    <div className=" flex h-[70px] w-[320px] overflow-hidden rounded-xl bg-[#00000021] dark:bg-[#FFFAE621]">
      <div className="h-full w-[22%] p-2">
        <div className="relative h-full w-full overflow-hidden rounded-xl ">
          <Image src={img} alt="" fill />
        </div>
      </div>
      <div className="flex h-full w-[46%] items-center  pl-2 font-medium">
        <div> {name}</div>
      </div>
      <div className="flex h-full w-[16%] items-center justify-center">
        <div
          className="cursor-pointer hover:text-green-500"
          onClick={() => {
            acceptRequest.mutate({ senderId, receiverId });
          }}
        >
          <Check />
        </div>
      </div>
      <div className="flex h-full w-[16%] items-center justify-center">
        <div
          className=" cursor-pointer hover:text-red-500"
          onClick={() => {
            rejectRequest.mutate({
              senderId,
              receiverId,
            });
          }}
        >
          {" "}
          <X />
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
