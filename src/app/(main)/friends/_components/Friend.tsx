import { api } from "~/trpc/server";
import FriendCard from "./FriendCard";
import { Skeleton } from "~/components/ui/skeleton";

const Friend = async ({
  id,
  currUserId,
}: {
  id: string;
  currUserId: string;
}) => {
  const user = await api.user.find({ id: id });

  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[120px] w-[160px] rounded-xl"></Skeleton>
        <Skeleton className="h-10 w-[120px] rounded-xl"></Skeleton>
      </div>
    );
  }
  const name = user.name;
  const img = user.image;
  const userId = user.id;

  return (
    <div>
      <FriendCard name={name} img={img} id={userId} currUserId={currUserId} />
    </div>
  );
};

export default Friend;
