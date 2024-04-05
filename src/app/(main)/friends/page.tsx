import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Friend from "./_components/Friend";
import Request from "./_components/Request";
import People from "./_components/People";
import Toaster from "./_components/Toaster";

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
        <div className="flex h-[83%] w-full flex-col ">
          <div className="pl-2 text-3xl font-bold">Friends</div>
          <div className="flex flex-wrap items-start justify-start gap-6 pl-2 pt-6">
            {user.friends.map((id) => (
              <Friend key={id} id={id} currUserId={userId} />
            ))}
          </div>
        </div>
        <div className="h-[17%] w-full pr-2">
          <div className="flex h-full w-full flex-col rounded-b-xl bg-[#202022]">
            <div className="flex h-[30%] w-full justify-end ">
              <div className="h-full w-[86%] rounded-br-[20px] bg-white"></div>
              <div className="h-full w-[12%] bg-white">
                <div className="flex h-full justify-end rounded-t-[20px] bg-[#202022] px-4 font-urbanist text-2xl font-bold text-[#E6CA62]">
                  <div className=""> requests</div>
                </div>
              </div>
              <div className="h-full w-[2%] bg-[#202022]">
                <div className="h-full w-full rounded-bl-[15px] bg-white"></div>
              </div>
            </div>
            <div className="h-[70%] w-full bg-white">
              <div className="h-full w-full rounded-xl bg-[#202022]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[96%] w-[25%] flex-col items-center justify-start rounded-xl bg-[#202022]">
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
        <div className="flex h-[80%] w-full items-start justify-center overflow-y-scroll">
          <People id={userId} />
        </div>
        {/*  <div className="flex h-[50%] w-full flex-col items-start justify-start pt-4">
          <div className="text-2xl font-semibold">Requests</div>
          <div className="flex flex-col items-start justify-start gap-6 pt-6">
            {user.friendRequests.map((id) => (
              <Request key={id} id={id} userId={userId} />
            ))}
          </div>
        </div>
        <div className="flex h-[50%] w-full flex-col items-start justify-start gap-4">
          <div className="text-xl font-semibold">People you may know</div>
          <div>
           
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default page;
