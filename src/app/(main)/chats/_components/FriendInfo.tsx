import Image from "next/image";
import { api } from "~/trpc/react";
import UserFriend from "./UserFriend";

const FriendInfo = ({ friendId }: { friendId: string }) => {
  const { data, isLoading } = api.user.find.useQuery({ id: friendId });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No Data Found</div>;
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-start">
      <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full">
        <Image src={data.image} alt="" fill />
      </div>
      <div className="py-2 text-xl font-semibold">{data.name}</div>
      <div className="pb-4 text-sm text-slate-500">{data.email}</div>
      <div className="h-[25%] w-full rounded-xl bg-[#E2E2E2] dark:bg-[#E2E2E250]">
        <div className="flex w-full items-center justify-center py-2 font-semibold uppercase">
          Friends
        </div>

        <div className=" flex h-[70%] w-[300px] flex-wrap items-center justify-center gap-2 px-2 py-2">
          {data.friends.map((id) => (
            <UserFriend id={id} key={id} />
          ))}
        </div>
      </div>
      <div className="h-[25%] w-full">
        <div className="mt-3 h-full w-full rounded-xl bg-[#E2E2E2] dark:bg-[#E2E2E250]">
          <div className="flex w-full items-center justify-center py-2 text-sm font-semibold uppercase">
            Groups in Common
          </div>
        </div>
      </div>
      <div className="flex h-[10%] w-full items-center justify-center p-2 font-urbanist font-bold italic">
        Status
      </div>
    </div>
  );
};

export default FriendInfo;
