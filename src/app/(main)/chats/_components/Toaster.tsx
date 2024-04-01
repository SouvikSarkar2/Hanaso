"use client";
import React, { useEffect } from "react";
import { toast } from "~/components/ui/use-toast";
import { socket } from "~/socket";
import type { Message, onlineData } from "~/utils/Types";

const Toaster = ({ id }: { id: string }) => {
  useEffect(() => {
    console.log("effectCalled");
    socket.on("receiveMessage", (data: Message) => {
      if (id !== data.recipientId) {
        toast({
          title: `${data.senderName}`,
          description: `${data.content}`,
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
