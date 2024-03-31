import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Sidebar from "./_components/Sidebar";

import UserIdSetter from "../_components/userIdSetter";
import { socket } from "~/socket";
import { api } from "~/trpc/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const user = await api.user.find({ id: session.user.id });

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-white dark:bg-[#202022]">
      <div className="flex h-[100%] w-[100%] bg-[#202022] dark:bg-[#FFFAE6]">
        <Sidebar />
        <div className="flex h-[99%] w-[94%] items-center justify-center  bg-[##202022] dark:bg-[#F2EFE6]">
          <div className="h-[98%] w-[99%] rounded-xl bg-white dark:bg-[#202022]">
            <UserIdSetter name={user?.name} id={session.user.id} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
