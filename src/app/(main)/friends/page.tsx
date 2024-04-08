import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Friend from "./_components/Friend";
import Request from "./_components/Request";
import People from "./_components/People";
import Toaster from "../friends/_components/Toaster";

const page = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return;
  }

  const user = await api.user.find({ id: session.user.id });
  /* console.log(user); */

  if (!user) {
    return <div>Loading...</div>;
  }

  const userId = user.id;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Toaster />
      <div className="flex h-[96%] w-[73%] flex-col items-start justify-start">
        <div className="flex h-[83%] w-[98%] flex-col ">
          <div className=" pb-2 pl-2 font-urbanist text-3xl font-bold">
            Friends
          </div>
          <div className="flex h-full w-full flex-wrap items-start justify-start gap-6 overflow-y-scroll pl-2 pt-6">
            {user.friends.map((id) => (
              <Friend key={id} id={id} currUserId={userId} />
            ))}
          </div>
        </div>
        {user.friendRequests.length !== 0 && (
          <div className="h-[17%] w-full pr-2">
            <div className="flex h-full w-full flex-col rounded-b-xl bg-[#E6CA62]">
              <div className="flex h-[30%] w-full justify-end ">
                <div className="h-full w-[86%] rounded-br-[20px] bg-white"></div>
                <div className="h-full w-[12%] bg-white">
                  <div className="flex h-full justify-center rounded-t-[20px] bg-[#E6CA62] px-4 font-urbanist text-2xl font-bold text-[#202022]">
                    <div className=""> requests</div>
                  </div>
                </div>
                <div className="h-full w-[2%] bg-[#E6CA62]">
                  <div className="h-full w-full rounded-bl-[15px] bg-white"></div>
                </div>
              </div>
              <div className="h-[70%] w-full bg-white">
                <div className="scrollbar-w-2 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-[#202022] scrollbar-track-[#E6CA62] flex h-full w-full items-center justify-start gap-2 overflow-y-hidden overflow-x-scroll rounded-xl bg-[#E6CA62] px-2">
                  {user.friendRequests.map((id) => (
                    <Request key={id} id={id} userId={userId} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex h-[96%] w-[25%] flex-col items-center justify-start rounded-xl bg-[#202022] dark:bg-[#ffffff10]">
        <div className="flex h-[20%] w-full flex-col items-center justify-start pt-5 text-white">
          <div className="flex ">
            <div className="border-b-2 border-b-[#E6CA62] pr-2 font-urbanist text-4xl font-bold text-[#E6CA62]">
              PEOPLE
            </div>
            <div className="flex h-[80%] items-end justify-start text-lg font-medium italic">
              You
            </div>
          </div>
          <div className="flex items-center justify-start">
            <div className="flex h-[80%] items-end justify-end text-lg font-medium italic">
              May
            </div>
            <div className="border-b-2 border-b-[#E6CA62] pl-2 font-urbanist text-4xl font-bold text-[#E6CA62]">
              KNOW
            </div>
          </div>
        </div>
        <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-[#E6CA62] scrollbar-track-[#202022] flex h-[80%] w-full items-start justify-center overflow-y-scroll">
          <People id={userId} />
        </div>
      </div>
    </div>
  );
};

export default page;
