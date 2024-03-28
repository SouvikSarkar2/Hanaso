import { api } from "~/trpc/server";
import FriendCard from "./FriendCard";

const Friend = async ({
  id,
  currUserId,
}: {
  id: string;
  currUserId: string;
}) => {
  const user = await api.user.find({ id: id });

  if (!user) {
    return <div>Loading</div>;
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
