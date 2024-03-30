import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Sidebar from "./_components/Sidebar";
import { useUserIdStore } from "~/store";
import UserIdSetter from "../_components/userIdSetter";
import { socket } from "~/socket";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }
  // socket.connect();

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-white dark:bg-[#202022]">
      <UserIdSetter id={session.user.id} />
      <div className="flex h-[95%] w-[98%] rounded-3xl bg-[#202022] dark:bg-[#FFFAE6]">
        <Sidebar />
        <div className="flex h-full w-[94%] items-center justify-center">
          <div className="h-[98%] w-[99%] rounded-3xl bg-white dark:bg-[#202022]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
