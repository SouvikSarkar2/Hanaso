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

type OnlineUserStore = {
  users: string[];
  setOnlineUsers: (data: string[]) => void;
};

export const useOnlineUserStore = create<OnlineUserStore>()((set) => ({
  users: [],
  setOnlineUsers: (data) => set(() => ({ users: data })),
}));

type offlineUserData = {
  userId: string;
  time: Date;
};

type OfflineUserStore = {
  offlineUsers: offlineUserData[];
  setOfflineUsers: (data: offlineUserData[]) => void;
};

export const useOfflineUserStore = create<OfflineUserStore>()((set) => ({
  offlineUsers: [],
  setOfflineUsers: (data) => set(() => ({ offlineUsers: data })),
}));
