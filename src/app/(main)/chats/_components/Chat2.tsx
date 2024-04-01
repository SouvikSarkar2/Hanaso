import {
  EllipsisVertical,
  Mic,
  Paperclip,
  Phone,
  Search,
  Send,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { socket } from "~/socket";

import { api } from "~/trpc/react";
import type { Message } from "~/utils/Types";

const Chat2 = ({
  roomId,
  name,
  senderId,
  recipientId,
  senderName,
}: {
  roomId: string;
  name: string;
  senderId: string;
  recipientId: string;
  senderName: string;
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const messages = api.conversation.findMessage.useQuery({
    conversationId: roomId,
  });

  const addMessage = api.conversation.addMessage.useMutation({});

  useEffect(() => {
    if (messages.data) {
      setMessageList(messages.data);
    }
  }, [messages.data]);

  useEffect(() => {
    console.log("effectCalled");
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
      id: "",
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
    <div className="flex h-full w-full flex-col items-center justify-start  px-2">
      <div className="flex h-[12%] w-full items-center justify-between">
        <div className="flex h-full flex-col justify-evenly">
          <div className="font-urbanist text-2xl font-bold">{name}</div>
          <div className="font-bold text-green-500">online</div>
        </div>
        <div className="flex h-full items-center gap-4">
          <Search />
          <Phone />
          <EllipsisVertical />
        </div>
      </div>
      <div className="h-[78%] w-full ">
        {messageList.map((el) => (
          <div key={el.id}>{el.content}</div>
        ))}
      </div>
      <div className="flex h-[10%] w-full items-center justify-center ">
        <div className="relative h-[65%] w-[95%]">
          <Input
            placeholder="Your Message"
            value={message}
            className="h-full w-full rounded-[5px] border-2 border-black pl-10"
            onChange={(e) => setMessage(e.target.value)}
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
