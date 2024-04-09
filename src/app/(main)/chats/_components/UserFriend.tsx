"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

import Image from "next/image";
import { api } from "~/trpc/react";
import { useUserIdStore } from "~/store";

const UserFriends = ({ id }: { id: string }) => {
  const { userId } = useUserIdStore();
  const res = api.user.find.useQuery({ id });
  if (res.isLoading) {
    return <div>Loading..</div>;
  }
  if (!res.data) {
    return <div>No DAta Found</div>;
  }
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-red-200">
          <Image src={res.data.image} alt="" fill />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto rounded-xl dark:bg-[#202022]">
        <div className="flex flex-col items-center justify-center">
          <div>{userId === res.data.id ? "You" : res.data.name}</div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserFriends;
