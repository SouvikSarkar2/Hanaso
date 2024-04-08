"use client";
import React, { useEffect } from "react";

import { socket } from "~/socket";
import type { Message } from "~/utils/Types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const Toaster = () => {
  const Router = useRouter();
  useEffect(() => {
    console.log("effectCalled");
    socket.on("receiveMessage", (data: Message) => {
      toast(`${data.senderName}`, {
        description: `${data.content}`,
        action: {
          label: "Reply",
          onClick: () => Router.push(`/chats/?q=${data.senderId}`),
        },
      });
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [Router]);
  return <div></div>;
};

export default Toaster;
