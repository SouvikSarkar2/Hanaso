import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Sidebar from "./_components/Sidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-[#FFFAE6] dark:bg-black">
      <div className="flex h-[95%] w-[98%] rounded-3xl bg-black dark:bg-[#FFFAE6]">
        <Sidebar />
        <div className="flex h-full w-[94%] items-center justify-center">
          <div className="h-[98%] w-[99%] rounded-3xl bg-[#FFFAE6] dark:bg-black">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
