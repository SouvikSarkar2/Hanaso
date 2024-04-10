"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { socket } from "~/socket";
import {
  useOfflineUserStore,
  useOnlineUserStore,
  useUserIdStore,
} from "~/store";
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
  const { setOnlineUsers } = useOnlineUserStore();
  const { setOfflineUsers } = useOfflineUserStore();
  const { data, isLoading, refetch } =
    api.conversation.findConversationsOfUser.useQuery({
      id: id,
    });

  useEffect(() => {
    socket.connect();
    setUserId(id);
    setUserName(name);
    socket.emit("online", { userId: id, userName: name });

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

  useEffect(() => {
    socket.on("onlineCheck", (onlineData: string[]) => {
      setOnlineUsers(onlineData);
    });

    return () => {
      socket.off("onlineCheck");
    };
  }, []);

  useEffect(() => {
    socket.on(
      "offlineCheck",
      (offlineData: { userId: string; time: Date }[]) => {
        setOfflineUsers(offlineData);
      },
    );

    return () => {
      socket.off("offlineCheck");
    };
  }, [setOfflineUsers]);

  useEffect(() => {
    socket.on("friendChanges", async () => {
      Router.prefetch("/friends");
      Router.refresh();
      await refetch();
    });
  }, [Router, refetch]);

  if (isLoading) {
    return <div></div>;
  }

  if (!data) {
    return <div></div>;
  }

  return <div></div>;
};

export default UserIdSetter;
