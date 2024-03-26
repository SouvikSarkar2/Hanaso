import Link from "next/link";

const page = () => {
  return (
    <div>
      Chat Page<Link href={"/api/auth/signout"}>out</Link>
    </div>
  );
};

export default page;
