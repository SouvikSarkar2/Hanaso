import {
  EllipsisVertical,
  Mic,
  Paperclip,
  Phone,
  Search,
  Send,
} from "lucide-react";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { socket } from "~/socket";
import { useOfflineUserStore, useOnlineUserStore } from "~/store";
import { stringify as uuidStringify } from "uuid";
import { api } from "~/trpc/react";
import type { Message } from "~/utils/Types";
import { string } from "zod";

const Chat2 = ({
  roomId,
  name,
  senderId,
  recipientId,
  senderName,
  img,
}: {
  roomId: string;
  name: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  img: string;
}) => {
  const { toast } = useToast();
  const { users } = useOnlineUserStore();
  const { offlineUsers } = useOfflineUserStore();
  const [message, setMessage] = useState<string>("");
  const [userStatus, setUserStatus] = useState<string>();
  const [messageList, setMessageList] = useState<Message[]>([]);
  const messages = api.conversation.findMessage.useQuery({
    conversationId: roomId,
  });
  const messageEndRef: RefObject<HTMLDivElement> = useRef(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messageList]);
  const addMessage = api.conversation.addMessage.useMutation({});
  useEffect(() => {
    if (users.includes(recipientId)) {
      setUserStatus("online");
    } else {
      let present = false;
      offlineUsers.map((user) => {
        if (user.userId === recipientId) {
          present = true;
          const readableTime =
            new Date(user.time).getHours() +
            ":" +
            new Date(user.time).getMinutes();
          setUserStatus(`Last Seen on ${readableTime}`);
          return;
        }
      });
      if (!present) {
        setUserStatus("offline");
      }
    }
  }, [users, recipientId, offlineUsers]);

  useEffect(() => {
    if (messages.data) {
      setMessageList(messages.data);
    }
  }, [messages.data]);

  useEffect(() => {
    socket.on(
      "statusCheck",
      (data: { status: string; roomId: number; senderId: string }) => {
        if (data.senderId === recipientId) {
          setUserStatus(data.status);
        }
      },
    );

    return () => {
      socket.off("statusCheck");
    };
  }, [recipientId]);

  useEffect(() => {
    socket.on("receiveMessage", (data: Message) => {
      if (data.senderId === recipientId) {
        setMessageList((list) => [...list, data]);
        console.log("received");
      } else {
        toast({
          title: `${data.senderName}`,
          description: `${data.content}`,
        });
      }
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [recipientId, toast, name]);
  if (messages.isLoading) {
    return <div>Loading...</div>;
  }

  const handleMessageSend = async () => {
    const messageData = {
      id: Math.random().toString(),
      conversationId: roomId,
      senderId: senderId,
      recipientId: recipientId,
      content: message,
      sentAt: new Date(),
      senderName: senderName,
    };

    socket.emit("sendMessage", messageData);
    setMessageList((list) => [...list, messageData]);
    setMessage("");
    addMessage.mutate(messageData);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-start ">
      <div className="flex h-[12%] w-full items-center justify-between border-b-2 border-b-black">
        <div className="relative h-full w-[9%] p-3">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image src={img} fill alt="" />
          </div>
          {userStatus === "online" || userStatus === "typing..." ? (
            <div className="absolute bottom-3 right-4 z-10 h-4 w-4 rounded-full bg-green-500"></div>
          ) : (
            <div className="absolute bottom-3 right-4 z-10 h-4 w-4 rounded-full bg-gray-500"></div>
          )}
        </div>
        <div className="flex h-full w-[71%] flex-col justify-evenly">
          <div className="flex h-[50%] items-end font-urbanist text-2xl font-bold">
            {name}
          </div>
          <div
            className={`h-[50%] font-bold ${userStatus !== "online" ? "text-gray-400" : "text-green-500"}`}
          >
            {userStatus !== "online" && userStatus}
          </div>
        </div>
        <div className="flex h-full w-[20%] items-center justify-end gap-4">
          <Search />
          <Phone />
          <EllipsisVertical />
        </div>
      </div>
      <div className="flex h-[78%] w-full flex-col gap-3 overflow-y-scroll py-2 pl-4 pr-2">
        {messageList.map((el) => (
          <div
            key={el.id}
            className={`flex w-full ${el.senderId === senderId ? " justify-end" : ""} `}
          >
            <div className={`flex flex-col gap-1 font-medium   `}>
              <div
                className={`rounded-b-xl bg-[#20202221] px-3 py-2 font-urbanist font-semibold dark:bg-[#ffffff21] dark:text-gray-300 ${el.senderId === senderId ? "rounded-l-xl" : "rounded-r-xl"}`}
              >
                {el.content}
              </div>
              <div className="flex w-full min-w-[100px] justify-end pb-1 pr-1 text-xs font-medium text-slate-600 dark:text-slate-500">
                {new Date(el.sentAt).getHours() +
                  ":" +
                  new Date(el.sentAt).getMinutes()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="flex h-[10%] w-full items-center justify-center ">
        <div className="relative h-[65%] w-[95%]">
          <Input
            placeholder="Your Message"
            value={message}
            className="h-full w-full rounded-[5px] border-2 border-black pl-10 font-medium dark:border-[#ffffff21]"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={async (event) => {
              if (event.key === "Enter") {
                await handleMessageSend();
              }
            }}
            onFocus={() =>
              socket.emit("status", { status: "typing...", roomId, senderId })
            }
            onBlur={() =>
              socket.emit("status", { status: "online", roomId, senderId })
            }
          />
          <Paperclip className="absolute left-3 top-3" size={20} />
          <div className="absolute right-0 top-0 flex h-[100%] ">
            <div className="flex h-full w-[50px] items-center justify-center ">
              <Mic className="" size={20} />
            </div>
            <div
              className="flex h-full w-[50px] cursor-pointer items-center justify-center"
              onClick={() => handleMessageSend()}
            >
              <Send className=" " size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat2;
