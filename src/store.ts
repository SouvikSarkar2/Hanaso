import { create } from "zustand";

type UserIdStore = {
  userId: string | undefined;
  setUserId: (id: string | undefined) => void;
};

export const useUserIdStore = create<UserIdStore>()((set) => ({
  userId: "0",
  setUserId: (id) => set(() => ({ userId: id })),
}));
