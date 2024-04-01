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
    <div className=" flex h-[70px] w-[300px] overflow-hidden rounded-xl bg-[#00000021] dark:bg-[#FFFAE621]">
      <div className="h-full w-[24%] p-2">
        <div className="relative h-full w-full overflow-hidden rounded-full ">
          <Image src={img} alt="" fill />
        </div>
      </div>
      <div className="flex h-full w-[55%] pl-2 pt-2 font-medium">{name}</div>
      <div className="flex h-full w-[20%] items-center justify-center">
        {present ? (
          <div
            className=" cursor-pointer hover:text-red-500"
            onClick={() => {
              deleteRequest.mutate({
                senderId: userId,
                receiverId: peopleId,
              });
            }}
          >
            <X />
          </div>
        ) : (
          <div
            className=" cursor-pointer hover:text-green-700"
            onClick={() => {
              sendRequest.mutate({ senderId: userId, receiverId: peopleId });
            }}
          >
            <UserRoundPlus />
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleCardClient;
