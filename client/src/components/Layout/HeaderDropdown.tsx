"use client";

import { logout } from "@/lib/actions";
import { useState } from "react";

type HeaderDropdownProps = {
  user: User;
};

export default function HeaderDropdown({ user }: HeaderDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav
      className="relative flex"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <button className="flex justify-center items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white/20 hover:shadow z-1 text-white min-w-30">
        <img
          src="/"
          alt=""
          className="bg-white h-full aspect-square rounded-full"
        />
        <h1 className="text-xl text-nowrap">{user?.name || "Login"}</h1>
      </button>

      <ul
        className={`bg-white flex flex-col justify-around **:flex **:justify-between **:flex-nowrap *:hover:bg-(--primary)/5 w-[90%] absolute border-b border-l border-r rounded-b top-full right-[5%] transition-all overflow-hidden ${
          isDropdownOpen ? "h-20" : "h-0"
        }`}
      >
        <li>
          <a href="/profile" className="w-full px-3 py-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="w-5 fill-(--primary)"
            >
              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
            </svg>
            Perfil
          </a>
        </li>
        <li>
          <button
            className="cursor-pointer w-full px-3 py-1"
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="w-5 fill-(--primary)"
            >
              <path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path>
            </svg>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
