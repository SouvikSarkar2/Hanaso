import { create } from "zustand";

type UserIdStore = {
  userId: string | undefined;
  userName: string | undefined;
  setUserId: (id: string | undefined) => void;
  setUserName: (id: string | undefined) => void;
};

export const useUserIdStore = create<UserIdStore>()((set) => ({
  userId: "0",
  userName: "Unknown",
  setUserId: (id) => set(() => ({ userId: id })),
  setUserName: (name) => set(() => ({ userName: name })),
}));
