import { decrypt } from "@/lib/session";
import { getUser } from "@/services/db";
import { cookies } from "next/headers";
import React from "react";
import HeaderDropdown from "./HeaderDropdown";

export default async function Header() {
  const sessionCookie = (await cookies()).get("session")?.value;

  const session = await decrypt(sessionCookie);

  const userId = session?.userId;

  const user = await getUser(userId?.toString() || "");
  console.log("Fetched user:", user);

  return (
    <header className="flex justify-between items-center bg-(--primary) p-2 shadow transition z-2">
      {/* Logo */}
      <a href="/" className="">
        <img src="/logo_white.webp" alt="" className="h-14 object-contain" />
      </a>

      {/* Perfil */}
      <HeaderDropdown user={user} />
    </header>
  );
}
