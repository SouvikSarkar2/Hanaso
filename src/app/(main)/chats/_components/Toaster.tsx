"use client";
import React, { useEffect } from "react";
import { socket } from "~/socket";
import type { Message } from "~/utils/Types";

const Toaster = ({ id }: { id: string }) => {
  useEffect(() => {
    console.log("effectCalled");
    socket.on("receiveMessage", (data: Message) => {
      if (id !== data.recipientId) {
      }
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);
  return <div></div>;
};

export default Toaster;
