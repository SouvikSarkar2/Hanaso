import { api } from "~/trpc/server";
import FriendCard from "./FriendCard";
import RequestCard from "./RequestCard";

const Request = async ({ id, userId }: { id: string; userId: string }) => {
  const user = await api.user.find({ id: id });

  if (!user) {
    return <div>Loading</div>;
  }
  const name = user.name;
  const img = user.image;
  const senderId = user.id;

  return (
    <div>
      <RequestCard
        name={name}
        img={img}
        senderId={senderId}
        receiverId={userId}
      />
    </div>
  );
};

export default Request;
