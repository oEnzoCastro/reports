"use client";

import React, { useState } from "react";
import ClientsAside from "./ClientsAside";
import CreateClient from "./CreateClient";
import ClientDetails from "./ClientDetails";
import { Client } from "../../models/Client";

export default function ClientsPageWrapper() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAsideOpen, setIsAsideOpen] = useState(true);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };
  

  return (
    <div className="clients-page w-full">
      {isAsideOpen && (
        <ClientsAside
          onClientSelect={handleClientSelect}
          onClose={toggleAside}
        />
      )}

      <main
        className={`clients-main ${
          !isAsideOpen ? "clients-main--full-width" : ""
        }`}
      >
        <div className="clients-main__header">
          {!isAsideOpen && (
            <button
              className="clients-main__toggle-button"
              onClick={toggleAside}
              title="Mostrar lista de clientes"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="2"></rect>
                <rect x="3" y="11" width="18" height="2"></rect>
                <rect x="3" y="18" width="18" height="2"></rect>
              </svg>
              Clientes
            </button>
          )}
        </div>
        {selectedClient ? (
          <ClientDetails client={selectedClient} />
        ) : (
          <div className="clients-main__placeholder">
            <div className="clients-main__placeholder-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
              </svg>
            </div>
            <h2 className="clients-main__placeholder-title">
              Selecione um cliente
            </h2>
            <p className="clients-main__placeholder-text">
              Escolha um cliente na barra lateral para visualizar seus detalhes
              e relatórios
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
