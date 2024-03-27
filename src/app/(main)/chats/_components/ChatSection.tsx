"use client";

import { Cross, X } from "lucide-react";
import { useState } from "react";

const ChatSection = () => {
  const [isInfoClicked, setIsInfoClicked] = useState<boolean>(false);
  const [isMembersClicked, setIsMembersClicked] = useState<boolean>(false);
  return (
    <div
      className={`flex h-full w-full ${isMembersClicked || isInfoClicked ? "gap-2" : ""} bg-black dark:bg-[#FFFAE6]`}
    >
      <div className="h-full w-full rounded-3xl bg-[#FFFAE6] duration-500 dark:bg-black">
        <div onClick={() => setIsInfoClicked(!isInfoClicked)}>Info</div>
        <div onClick={() => setIsMembersClicked(!isMembersClicked)}>Member</div>
      </div>
      <div className="flex flex-col gap-2">
        {isInfoClicked && (
          <div className="flex h-full min-w-[320px] flex-col justify-start rounded-3xl bg-[#FFFAE6] duration-500 dark:bg-black ">
            <div className="flex w-full justify-end p-2 ">
              <div onClick={() => setIsInfoClicked(false)}>
                <X />
              </div>
            </div>
          </div>
        )}
        {isMembersClicked && (
          <div className="flex h-full min-w-[320px] flex-col rounded-3xl bg-[#FFFAE6] duration-500 dark:bg-black">
            <div className="flex w-full justify-end p-2 ">
              <div onClick={() => setIsMembersClicked(false)}>
                <X />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;
