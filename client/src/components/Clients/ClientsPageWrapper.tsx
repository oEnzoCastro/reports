"use client";

import React, { useState } from "react";
import ClientsAside from "./ClientsAside";
import CreateClient from "./CreateClient";

interface Client {
  id: string;
  name: string;
  gender: string;
  profession: string;
}

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
          <div className="clients-main__selected">
            <h2>Cliente Selecionado: {selectedClient.name}</h2>
            <p>Gênero: {selectedClient.gender}</p>
            <p>Profissão: {selectedClient.profession}</p>
            {/* Here you can add more detailed client information */}
          </div>
        ) : (
          <div className="clients-main__placeholder">
            <div className="clients-main__placeholder-icon">👥</div>
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
