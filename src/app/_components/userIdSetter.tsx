"use client";

import { useEffect } from "react";
import { useUserIdStore } from "~/store";

const UserIdSetter = ({ id }: { id: string | undefined }) => {
  const { setUserId } = useUserIdStore();
  useEffect(() => {
    setUserId(id);
  }, [id, setUserId]);

  return <div></div>;
};

export default UserIdSetter;
