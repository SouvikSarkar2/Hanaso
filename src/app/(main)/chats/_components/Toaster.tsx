"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { socket } from "~/socket";
import type { Message } from "~/utils/Types";

const Toaster = ({ id }: { id: string }) => {
  const Router = useRouter();
  useEffect(() => {
    console.log("effectCalled");
    socket.on("receiveMessage", (data: Message) => {
      if (id !== data.recipientId) {
        toast(`${data.senderName}`, {
          description: `${data.content}`,
          action: {
            label: "Reply",
            onClick: () => Router.push(`/chats/?q=${data.senderId}`),
          },
        });
      }
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);
  return <div></div>;
};

export default Toaster;
