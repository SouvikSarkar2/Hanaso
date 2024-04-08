import Image from "next/image";
import { api } from "~/trpc/react";

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
        {data.friends.map((friend) => (
          <div key={friend}>{friend}</div>
        ))}
      </div>
      <div className="h-[25%] w-full "></div>
    </div>
  );
};

export default FriendInfo;
