import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import ThemeSwitch from "./_components/ThemeSwitch";
import { MoveUpRight } from "lucide-react";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-black duration-500 dark:bg-[#FFFAE6]">
      <div className=" flex h-[95%] w-[98%] flex-col items-center justify-center rounded-3xl bg-[#FFFAE6] dark:bg-black dark:text-[#FFFAE6]">
        <div className="flex h-[15%] w-full flex-row justify-between px-10">
          <div className="flex flex-row items-center justify-center gap-24 p-2">
            <div className="font-[Urbanist] text-3xl font-bold">HANASO</div>
            <div className="flex flex-row gap-4 font-[Oswald] text-xl font-light">
              <div>Business</div>
              <div>Pricing</div>
              <div>Services</div>
              <div>Solutions</div>
              <div>FAQ</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div>
              <ThemeSwitch />
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-full border-[1px] border-black px-4 py-2 font-semibold dark:border-[#FFFAE6]">
                Register
              </div>
              <div className="rounded-full bg-black p-2 text-[#FFFAE6] dark:bg-[#FFFAE6] dark:text-black">
                <MoveUpRight />
              </div>
            </div>
          </div>
        </div>
        <div className="h-[70%] w-full "></div>
        <div className="h-[15%] w-full "></div>

        <div></div>
        <div></div>
      </div>
    </div>
  );
}
