"use client";

import {
  Bot,
  Cog,
  MessageCircleCode,
  NotebookTabs,
  Phone,
  Plug,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState<string>(pathname);

  return (
    <div className="font-urbanist flex h-full w-[6%] flex-col items-center justify-between rounded-3xl bg-[#202022] py-8 pl-2 text-sm text-white dark:bg-[#F2EFE6] dark:text-black">
      <Link href={"/"} className="flex w-full items-center justify-center ">
        <Bot size={40} />
      </Link>
      <div className="flex flex-col items-center justify-center gap-8">
        <div>
          <Link
            href={"/chats"}
            className={` ${isActive === "/chats" ? "rounded-xl bg-[#96969688] px-3 py-1" : ""} flex flex-col items-center justify-center gap-1 duration-500`}
            onClick={() => setIsActive("/chats")}
          >
            <div>
              <MessageCircleCode size={22} />
            </div>
            <div>Chats</div>
          </Link>
        </div>
        <div>
          <Link
            href={"/friends"}
            className={` ${isActive === "/friends" ? "rounded-xl bg-[#96969688] px-3 py-1" : ""} flex flex-col items-center justify-center gap-1 duration-500`}
            onClick={() => setIsActive("/friends")}
          >
            <div>
              <NotebookTabs size={22} />
            </div>
            <div>Friends</div>
          </Link>
        </div>

        <div>
          <Link
            href={"/groups"}
            className={` ${isActive === "/groups" ? "rounded-xl bg-[#96969688] px-3 py-1" : ""} flex flex-col items-center justify-center gap-1 duration-500`}
            onClick={() => setIsActive("/groups")}
          >
            <div>
              <UsersRound size={22} />
            </div>
            <div>Groups</div>
          </Link>
        </div>
        <div>
          <Link
            href={"/calls"}
            className={` ${isActive === "/calls" ? "rounded-xl bg-[#96969688] px-3 py-1" : ""} flex flex-col items-center justify-center gap-1 duration-500`}
            onClick={() => setIsActive("/calls")}
          >
            <div>
              <Phone size={22} />
            </div>
            <div>Calls</div>
          </Link>
        </div>
        <div>
          <div className=" h-8 w-[100%] border-t-[2px] border-t-[#FFFAE6] dark:border-t-black"></div>

          <Link
            href={"/settings"}
            className={` ${isActive === "/settings" ? "rounded-xl bg-[#96969688] px-3 py-1" : ""} flex flex-col items-center justify-center gap-1 duration-500`}
            onClick={() => setIsActive("/settings")}
          >
            <div>
              <Cog size={22} />
            </div>
            <div>Settings</div>
          </Link>
        </div>
      </div>
      <Link
        href={"/api/auth/signout"}
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl  px-4 py-1 font-semibold duration-500 hover:bg-red-500 hover:text-black "
      >
        <div>
          <Plug size={24} />
        </div>
        <div>Log out</div>
      </Link>
    </div>
  );
};

export default Sidebar;
