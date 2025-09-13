"use client";

import React, { useActionState, useEffect, useState } from "react";
import "@/app/clients/style.css"; // Assuming you have a CSS file for styles
import { createClient } from "@/lib/actions";
import { fetchArticle } from "@/services/db";
import TextEditor from "./TextEditor";

export default function Clients({ userClients }: any) {
  const [isAddClientOpen, setIsAddClientOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState(null);
  const [state, createClientAction] = useActionState(createClient, undefined);

  const [Dependents, setDependents] = React.useState<number[]>([]);

  return (
    <div className="w-full h-full ">
    </div>
  );
}
