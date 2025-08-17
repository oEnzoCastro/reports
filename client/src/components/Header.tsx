import { decrypt } from "@/lib/session";
import { fetchUser } from "@/services/db";
import { cookies } from "next/headers";
import React from "react";
import HeaderDropdown from "./HeaderDropdown";

export default async function Header() {
  const session = await decrypt((await cookies()).get("session")?.value);

  const userId = session?.userId;
  const user = await fetchUser(userId?.toString() || "");

  return (
    <header className="flex justify-between items-center bg-(--petrolBlue) p-2 shadow transition">
      {/* Logo */}
      <a href="/" className="">
        <img src="/logo_white.webp" alt="" className="h-14 object-contain" />
      </a>


      {/* Perfil */}
      <HeaderDropdown user={user} />
    </header>
  );
}
