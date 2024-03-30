import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Friend from "./_components/Friend";
import Request from "./_components/Request";
import People from "./_components/People";

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
      <div className="flex h-[95%] w-[48%] flex-col items-start justify-start  pt-4">
        <div className="pl-2 text-3xl font-bold">Friends</div>
        <div className="flex flex-wrap items-start justify-start gap-6 pl-2 pt-6">
          {user.friends.map((id) => (
            <Friend key={id} id={id} currUserId={userId} />
          ))}
        </div>
      </div>
      <div className="flex h-[95%] w-[48%] flex-col items-center justify-start">
        <div className="flex h-[50%] w-full flex-col items-start justify-start pt-4">
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
            <People id={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
