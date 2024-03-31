"use client";
import { useEffect } from "react";
import ChatSection from "./_components/ChatSection";
import { socket } from "~/socket";

const Page = () => {
  /* useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []); */
  return (
    <div className="h-full w-full">
      <ChatSection />
    </div>
  );
};

export default Page;
