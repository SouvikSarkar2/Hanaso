import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return <div>{children}</div>;
}
