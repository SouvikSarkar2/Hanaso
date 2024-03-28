import { api } from "~/trpc/server";
import PeopleCard from "./PeopleCard";

const People = async ({ id }: { id: string }) => {
  const people = await api.friend.findPeople({ id });
  /* console.log(people); */
  return (
    <div className="flex flex-wrap gap-4">
      {people.map((peopleId) => (
        <PeopleCard key={peopleId} peopleId={peopleId} userId={id} />
      ))}
    </div>
  );
};

export default People;
