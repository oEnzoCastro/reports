"use client";

import { logout } from "@/app/login/actions";
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-(--petrolBlue) p-2 shadow transition">
      {/* Logo */}
      <a href="/" className="">
        <img src="/logo_white.webp" alt="" className="h-15 object-contain" />
      </a>

      {/* Search */}
      <div className="relative w-full mx-20 justify-self-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className="absolute fill-white/40 p-1 h-full"
        >
          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
        </svg>
        <input
          type="text"
          placeholder="Pesquisar..."
          className="bg-white/20 focus:bg-white/15 border-1 border-white/30 text-white py-1 px-3 pl-10 rounded-md w-full focus:ring-2 outline-none transition duration-300"
        />
      </div>

      {/* Perfil */}
      <button
        className="flex justify-center items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white/20 text-white"
        onClick={() => logout()}
      >
        <img
          src="/"
          alt=""
          className="bg-white h-full aspect-square rounded-full"
        />
        <h1 className="text-xl">Adriana</h1>
      </button>
    </header>
  );
}
