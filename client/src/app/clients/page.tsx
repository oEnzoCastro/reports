import React from "react";
import "@/app/clients/style.css";
import ClientsPageWrapper from "@/components/ClientsPageWrapper";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export default async function ClientsPage() {
  const session = await decrypt((await cookies()).get("session")?.value);
  const userId = session?.userId;

  return <ClientsPageWrapper />;
}
