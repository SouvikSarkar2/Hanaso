"use client";
import React, { useEffect } from "react";
import { toast } from "~/components/ui/use-toast";
import { socket } from "~/socket";
import type { Message } from "~/utils/Types";

const Toaster = () => {
  useEffect(() => {
    console.log("effectCalled");
    socket.on("receiveMessage", (data: Message) => {
      toast({
        title: `${data.senderName}`,
        description: `${data.content}`,
      });
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);
  return <div></div>;
};

export default Toaster;
