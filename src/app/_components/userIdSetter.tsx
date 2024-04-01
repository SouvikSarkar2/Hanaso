"use client";

import { useRouter } from "next/navigation";
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
  const Router = useRouter();
  const { setUserId, setUserName } = useUserIdStore();
  const { data, isLoading, refetch } =
    api.conversation.findConversationsOfUser.useQuery({
      id: id,
    });

  useEffect(() => {
    socket.on("friendChanges", async () => {
      Router.prefetch("/friends");
      Router.refresh();
      await refetch();
    });
  }, [Router, refetch]);

  useEffect(() => {
    socket.connect();
    socket.emit("online", { userId: id, userName: name });
    setUserId(id);
    setUserName(name);

    if (data) {
      socket.off("JoinChatRoom");
      data.map((el) => {
        socket.emit("joinChatRoom", el);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [id, setUserId, name, setUserName, data, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No Chat Found</div>;
  }

  return <div></div>;
};

export default UserIdSetter;
