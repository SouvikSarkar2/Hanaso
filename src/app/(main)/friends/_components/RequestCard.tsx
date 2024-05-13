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
    <div className=" flex h-[50px] w-[350px]  overflow-hidden rounded-xl bg-[#202022] dark:bg-[#2E2E30] dark:text-black">
      <div className="flex h-full w-[50%] flex-row items-center  pl-2 font-medium">
        <div className="pl-2 font-urbanist text-lg font-bold text-[#E6CA62]">
          {name}
        </div>
      </div>
      <div className="flex h-full w-[28%] items-center justify-end ">
        <div
          className="cursor-pointer rounded-[4px] bg-[#E6CA62] px-2 py-0.5 font-urbanist font-bold"
          onClick={() => {
            acceptRequest.mutate({ senderId, receiverId });
          }}
        >
          Accept
        </div>
      </div>
      <div className="flex h-full w-[22%] items-center justify-center">
        <div
          className="cursor-pointer rounded-[4px] bg-red-600 px-2 py-0.5 font-urbanist font-bold"
          onClick={() => {
            rejectRequest.mutate({
              senderId,
              receiverId,
            });
          }}
        >
          Reject
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
