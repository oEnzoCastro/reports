import React from "react";
import "@/app/clients/style.css"; // Assuming you have a CSS file for styles
import Clients from "@/components/Clients";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { fetchClient} from "@/services/db";

export default async function page() {

    const session = await decrypt((await cookies()).get("session")?.value);
  
    const userId = session?.userId;
    const userclients = await fetchClient(userId?.toString() || "");
    

  return <Clients userClients={userclients} />;
}
