"use client";

import React, { useEffect, useState } from "react";
import ClientCard from "./ClientCard";
import { getClients } from "@/services/db";
import CreateClient from "./CreateClient";

interface Client {
  id: string;
  name: string;
  gender: string;
  profession: string;
}

interface ClientsAsideProps {
  onClientSelect?: (client: Client) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function ClientsAside({
  onClientSelect,
  onClose,
  isOpen = true,
}: ClientsAsideProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientClick = (client: Client) => {
    setSelectedClientId(client.id);
    onClientSelect?.(client);
  };

  useEffect(() => {
    async function fetchClients() {
      try {
        setIsLoading(true);
        const clients = await getClients();
        setClients(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, []);

  return (
    <aside className="clients-aside">
      <div className="clients-aside__header">
        <div className="clients-aside__header-top">
          <h2 className="clients-aside__title">Clientes</h2>
          <div className="clients-aside__header-buttons">
            <CreateClient />

            <button
              className="clients-aside__close-button"
              onClick={onClose}
              title="Fechar lista de clientes"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div className="clients-aside__search">
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clients-aside__search-input"
          />
        </div>
      </div>

      <div className="clients-aside__content">
        <div className="clients-aside__count">
          {isLoading ? (
            "Carregando..."
          ) : (
            <>
              {filteredClients.length}{" "}
              {filteredClients.length === 1 ? "cliente" : "clientes"}
            </>
          )}
        </div>

        <div className="clients-aside__list">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              id={client.id}
              name={client.name}
              gender={client.gender}
              profession={client.profession}
              isSelected={selectedClientId === client.id}
              onClick={() => handleClientClick(client)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
