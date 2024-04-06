"use client";

import { UserRoundPlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { socket } from "~/socket";
import { api } from "~/trpc/react";

const PeopleCardClient = ({
  peopleId,
  name,
  img,
  present,
  userId,
}: {
  peopleId: string;
  name: string;
  img: string;
  present: boolean;
  userId: string;
}) => {
  const router = useRouter();
  const sendRequest = api.friend.request.useMutation({
    onSuccess: () => {
      router.refresh();
      socket.emit("friendChanged", userId);
    },
  });
  const deleteRequest = api.friend.rejectRequest.useMutation({
    onSuccess: () => {
      router.refresh();
      socket.emit("friendChanged", userId);
    },
  });

  if (sendRequest.isPending) {
    return <div>Sending Request...</div>;
  }

  if (deleteRequest.isPending) {
    return <div>Deleting Request...</div>;
  }

  return (
    <div className=" flex h-[110px] w-[90%] overflow-hidden rounded-xl bg-white dark:bg-[#FFFAE621]">
      <div className=" h-full w-[35%] p-2">
        <div className="relative h-full w-full overflow-hidden rounded-xl ">
          <Image src={img} alt="" fill />
        </div>
      </div>
      <div className="flex h-full w-[65%] flex-col items-center justify-between">
        <div className="flex w-full flex-wrap pl-2 pt-3 font-urbanist text-xl font-bold">
          {name}
        </div>
        <div className="flex  w-full items-center justify-end p-2">
          {present ? (
            <div
              className=" cursor-pointer rounded-[5px] bg-red-500 px-2 py-0.5 font-urbanist font-bold"
              onClick={() => {
                deleteRequest.mutate({
                  senderId: userId,
                  receiverId: peopleId,
                });
              }}
            >
              Cancel
            </div>
          ) : (
            <div
              className=" cursor-pointer rounded-[5px] bg-[#E6CA62] px-2 py-0.5 font-urbanist font-bold"
              onClick={() => {
                sendRequest.mutate({ senderId: userId, receiverId: peopleId });
              }}
            >
              Add Friend
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleCardClient;
