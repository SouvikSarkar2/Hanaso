"use client";

import { useEffect } from "react";
import { socket } from "~/socket";
import { useUserIdStore } from "~/store";
import { api } from "~/trpc/react";

const UserIdSetter = ({
  id,
  name,
}: {
  id: string;
  name: string | undefined;
}) => {
  const { setUserId, setUserName } = useUserIdStore();
  const conversations = api.conversation.findConversationsOfUser.useQuery(
    {
      id: id,
    },
    {
      refetchInterval: 5000,
    },
  );

  useEffect(() => {
    socket.connect();
    setUserId(id);
    setUserName(name);
    if (conversations.data) {
      socket.off("JoinChatRoom");
      conversations.data.map((el) => {
        socket.emit("joinChatRoom", el);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [id, setUserId, name, setUserName, conversations.data]);

  if (conversations.isLoading) {
    return <div>Loading...</div>;
  }

  if (!conversations.data) {
    return <div>No Chat Found</div>;
  }

  return <div></div>;
};

export default UserIdSetter;
