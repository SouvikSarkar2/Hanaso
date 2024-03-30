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
import { socket } from "~/socket";
import { useUserIdStore } from "~/store";
import { api } from "~/trpc/react";
import Chat2 from "./Chat2";

const Chat = ({ id }: { id: string }) => {
  const { userId } = useUserIdStore();
  /* const [message, setMessage] = useState<string>(""); */

  const data = api.user.find.useQuery({ id });
  if (!userId) {
    return <div>No User Found</div>;
  }
  const conversationData = api.conversation.find.useQuery({
    Id1: id,
    Id2: userId,
  });
  if (conversationData.isLoading) {
    return <div>Loading...</div>;
  }
  if (!conversationData.data) {
    return <div>No Conversation Data Found</div>;
  }
  const roomId = conversationData.data.id;
  socket.emit("joinChatRoom", roomId);
  /* const handleMessageSend = async () => {
    console.log(roomId);
    const messageData = {
      room: roomId,
      author: data.data?.name,
      message: message,
    };

    socket.emit("sendMessage", messageData);
    console.log("emitted");
  }; */

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  if (!data.data) {
    return <div>Friend Not Found</div>;
  }
  const friend = data.data;
  const name = friend.name;

  return (
    <Chat2 roomId={roomId} name={name} senderId={userId} recipientId={id} />
  );
};

export default Chat;
