import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { socket } from "~/socket";
import { useUserIdStore } from "~/store";
import { api } from "~/trpc/react";
import Chat2 from "./Chat2";

const Chat = ({
  id,
  setIsInfoClicked,
  isInfoClicked,
}: {
  id: string;
  isInfoClicked: boolean;
  setIsInfoClicked: Dispatch<SetStateAction<boolean>>;
}) => {
  const { userId, userName } = useUserIdStore();

  const data = api.user.find.useQuery({ id });
  if (!userId || !userName) {
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

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  if (!data.data) {
    return <div>Friend Not Found</div>;
  }
  const friend = data.data;
  const name = friend.name;
  const img = friend.image;

  return (
    <Chat2
      roomId={roomId}
      senderName={userName}
      name={name}
      senderId={userId}
      recipientId={id}
      img={img}
      isInfoClicked={isInfoClicked}
      setIsInfoClicked={setIsInfoClicked}
    />
  );
};

export default Chat;
