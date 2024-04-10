"use client";

import ChatSection from "./_components/ChatSection";
import { useUserIdStore } from "~/store";

const Page = () => {
  const { userId } = useUserIdStore();

  if (!userId) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        UserUndefined
      </div>
    );
  }
  return (
    <div className="h-full w-full ">
      <ChatSection userId={userId} />
    </div>
  );
};

export default Page;
