"use client";
import { useEffect } from "react";
import ChatSection from "./_components/ChatSection";
import { socket } from "~/socket";
import { useUserIdStore } from "~/store";

const Page = () => {
  const { userId } = useUserIdStore();

  if (!userId) {
    return <div>UserUndefined</div>;
  }
  return (
    <div className="h-full w-full ">
      <ChatSection userId={userId} />
    </div>
  );
};

export default Page;
