import Header from "@/components/Layout/Header";
import MainBody from "@/components/MainBody";
import { decrypt } from "@/lib/session";
import { getClients } from "@/services/db";
import { cookies } from "next/headers";

export default async function Home() {
  const session = await decrypt((await cookies()).get("session")?.value);

  const userId = session?.userId;

  // Fetch real clients data
  let userClients = [];
  try {
    userClients = await getClients();
  } catch (error) {
    console.error("Error fetching clients:", error);
    userClients = [];
  }

  return (
    <div className="h-full font-sans">
      <MainBody userClients={userClients} />
    </div>
  );
}
