import { api } from "~/trpc/server";
import PeopleCardClient from "./PeopleCardClient";

const PeopleCard = async ({
  peopleId,
  userId,
}: {
  peopleId: string;
  userId: string;
}) => {
  const peopleData = await api.user.find({ id: peopleId });

  if (!peopleData) {
    return <div>Loading...</div>;
  }
  const img = peopleData.image;
  const name = peopleData.name;
  let present = false;
  peopleData.friendRequests.map((id) => {
    if (userId === id) {
      present = true;
    }
  });

  return (
    <div>
      <PeopleCardClient
        img={img}
        name={name}
        peopleId={peopleId}
        present={present}
        userId={userId}
      />
    </div>
  );
};

export default PeopleCard;
