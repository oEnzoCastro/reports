import Header from "@/components/Header";
import MainBody from "@/components/MainBody";
import { decrypt } from "@/lib/session";
import { fetchClient } from "@/services/db";
import { cookies } from "next/headers";

export default async function Home() {
  const session = await decrypt((await cookies()).get("session")?.value);

  const userId = session?.userId;
  const userclients = await fetchClient(userId?.toString() || "");

  return (
    <div className="font-sans">
      <MainBody userClients={userclients} />
    </div>
  );
}
