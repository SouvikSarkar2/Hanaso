import { api } from "~/trpc/server";
import ThemeSwitch from "./_components/ThemeSwitch";
import { Bot, MessageSquareQuote, MoveUpRight } from "lucide-react";
import Image from "next/image";
import { Tags } from "~/utils/Tags";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-black duration-500 dark:bg-[#FFFAE6]">
      <div className=" flex h-[95%] w-[98%] flex-col items-center justify-center rounded-3xl bg-[#FFFAE6] dark:bg-black dark:text-[#FFFAE6]">
        <div className="flex h-[15%] w-full flex-row justify-between px-10">
          <div className="flex flex-row items-center justify-center gap-24 p-2">
            <div className="flex items-center justify-center gap-2 font-[Urbanist] text-3xl font-bold">
              <Bot size={34} />
              HANASO
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div>
              <ThemeSwitch />
            </div>
            <div className="flex items-center justify-center">
              <Link
                href={"/chats"}
                className="cursor-pointer rounded-full border-[1px] border-black px-4 py-2 font-semibold text-black duration-500 hover:bg-black hover:text-[#FFFAE6] dark:border-[#FFFAE6] dark:text-[#FFFAE6] dark:hover:bg-[#FFFAE6] dark:hover:text-black"
              >
                {session ? "Enter" : "Register"}
              </Link>
              <div className="rounded-full bg-black p-2 text-[#FFFAE6] dark:bg-[#FFFAE6] dark:text-black">
                <MoveUpRight />
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[70%] w-full flex-row">
          <div className="flex h-full w-[50%] flex-col items-center justify-start px-24 py-10">
            <div className="flex w-full items-center gap-2">
              <div className="rounded-full bg-black px-4 py-1.5 text-[#FFFAE6] dark:bg-[#FFFAE6] dark:text-black">
                <div>100k +</div>
              </div>
              <div className="font-medium uppercase">Trusted Users</div>
            </div>
            <div className="w-full">
              <div className="py-10 font-[Urbanist] text-6xl">
                &quot;Where words meet, connections flourish.&quot;
              </div>
            </div>
            <div>
              <p className=" font-mono text-slate-800 dark:text-[#FFFAE6]">
                Experience instant connections with our{" "}
                <span className=" bg-black p-1 text-[#FFFAE6] dark:bg-[#FFFAE6] dark:text-black">
                  real-time
                </span>{" "}
                chat app. Stay close to your{" "}
                <span className="bg-black p-1 text-[#FFFAE6] dark:bg-[#FFFAE6] dark:text-black">
                  loved ones
                </span>
                , share moments, and spark conversations effortlessly. Join us{" "}
                <span className=" bg-black p-1 text-[#FFFAE6] dark:bg-[#FFFAE6] dark:text-black">
                  today
                </span>{" "}
                and start chatting instantly!
              </p>
            </div>
            <div className="flex w-full items-start justify-start px-2 py-4">
              <Link
                href={"/chats"}
                className="my-4 rounded-full bg-black px-4 py-2 text-[#FFFAE6] dark:bg-[#FFFAE6] dark:text-black"
              >
                GET STARTED
              </Link>
              <div>
                <MessageSquareQuote />
              </div>
            </div>
            <div></div>
          </div>
          <div className=" flex h-full w-[50%] items-end justify-center overflow-hidden  px-24 pt-5">
            <div className="relative h-full w-full overflow-hidden">
              <div className=" absolute right-0 top-0 overflow-hidden rounded-[100px]">
                {" "}
                <Image
                  className=""
                  src={`/landing4.png`}
                  alt=""
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[15%] w-full items-center justify-center">
          <div className="inline-flex h-full w-full flex-nowrap overflow-hidden ">
            <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_li]:mx-8">
              {Tags.map((el, i) => (
                <li key={i}>
                  <span className="rounded-full  px-4 py-2 text-xl font-light outline-dashed outline-1  dark:outline-[#FFFAE6]">
                    {el}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div></div>
        <div></div>
      </div>
    </div>
  );
}
