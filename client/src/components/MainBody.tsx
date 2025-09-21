"use client";

// Enhanced MainBody component with improved UX
import React, { useState, useEffect } from "react";
import { Client } from "@/models/Client";
import CreateClient from "./Clients/CreateClient";
import { getClients } from "@/services/db";

interface DashboardProps {
  userClients?: Client[];
}

export default function MainBody({ userClients = [] }: DashboardProps) {
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(userClients);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Update local state when userClients prop changes
  useEffect(() => {
    setClients(userClients);
  }, [userClients]);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClientCreated = async () => {
    setIsLoading(true);
    // Refresh clients data from server
    try {
      const updatedClients = await getClients();
      setClients(updatedClients);
    } catch (error) {
      console.error("Error refreshing clients:", error);
    } finally {
      setIsLoading(false);
    }

    // Close the modal
    setIsCreateClientOpen(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--background)] relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            <p className="text-[var(--primary)] font-medium">
              Atualizando dados...
            </p>
          </div>
        </div>
      )}

      <div
        className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--primary)] mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[var(--secondary)]">
            Bem-vindo ao seu painel de controle
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Clients Card */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-[var(--accent)] transition-all duration-200 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] rounded-lg">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
                  {clients.length}
                </p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[var(--primary)] mb-1">
              Total de Clientes
            </h3>
            <p className="text-sm text-[var(--secondary)]">
              Clientes ativos no sistema
            </p>
          </div>

          {/* Reports Card */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-[var(--accent)] transition-all duration-200 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
                  0
                </p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[var(--primary)] mb-1">
              Relatórios
            </h3>
            <p className="text-sm text-[var(--secondary)]">
              Total de relatórios gerados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-[var(--primary)] rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[var(--primary)]">
                Ações Rápidas
              </h2>
            </div>
            <div className="space-y-4">
              <button
                className="w-full group relative overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-xl p-4 hover:from-[var(--primary-hover)] hover:to-[var(--primary)] transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                onClick={() => setIsCreateClientOpen(true)}
              >
                <div className="flex items-center ">
                  <div className="p-2 bg-white/20 rounded-lg mr-4">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-lg">
                      Adicionar Cliente
                    </div>
                    <div className="text-sm opacity-90">
                      Cadastrar um novo cliente no sistema
                    </div>
                  </div>
                  <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                className="w-full group relative overflow-hidden bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] text-white rounded-xl p-4 hover:from-[var(--primary)] hover:to-[var(--primary)]/80 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                onClick={() => (window.location.href = "/clients")}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-white/20 rounded-lg mr-4">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-lg">Ver Clientes</div>
                    <div className="text-sm opacity-90">
                      Gerenciar clientes cadastrados
                    </div>
                  </div>
                  <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-[var(--accent)] rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[var(--primary)]">
                Atividade Recente
              </h2>
            </div>
            <div className="space-y-4">
              {clients.length > 0 ? (
                // Sort clients by ID (assuming higher ID = more recent) and take the 5 most recent
                clients
                  .slice()
                  .sort((a, b) => (b.id || 0) - (a.id || 0))
                  .slice(0, 3)
                  .map((client, index) => (
                    <div
                      key={client.id}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-[var(--accent)] hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--primary)]">
                          Cliente{" "}
                          <span className="font-semibold text-[var(--secondary)]">
                            {client.name}
                          </span>{" "}
                          foi adicionado
                        </p>
                        <p className="text-xs text-[var(--secondary)] mt-1">
                          {new Date().toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === 0
                              ? "bg-[var(--primary)]"
                              : index === 1
                              ? "bg-[var(--secondary)]"
                              : "bg-[var(--accent)]"
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                      />
                    </svg>
                  </div>
                  <p className="text-[var(--secondary)] text-sm font-medium">
                    Nenhuma atividade recente
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    As atividades aparecerão aqui conforme você usar o sistema
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CreateClient Modal */}
      <CreateClient
        isOpen={isCreateClientOpen}
        onClose={() => setIsCreateClientOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
