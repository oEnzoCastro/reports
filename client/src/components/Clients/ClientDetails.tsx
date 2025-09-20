import React, { useState, useEffect } from "react";
import { Client, Dependent } from "../../models/Client";
import {
  getDependents,
  deleteClient,
  deleteDependent,
} from "../../services/db";
import AddDependent from "./AddDependent";
import EditClient from "./EditClient";
import EditDependent from "./EditDependent";
import ConfirmDeleteModal from "../UI/ConfirmDeleteModal";

interface ClientDetailsProps {
  client: Client;
  onClientUpdated?: () => void;
  onClientDeleted?: () => void;
}

export default function ClientDetails({
  client,
  onClientUpdated,
  onClientDeleted,
}: ClientDetailsProps) {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loadingDependents, setLoadingDependents] = useState(false);
  const [showAddDependentModal, setShowAddDependentModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showEditDependentModal, setShowEditDependentModal] = useState(false);
  const [selectedDependent, setSelectedDependent] = useState<Dependent | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteClientModal, setShowDeleteClientModal] = useState(false);
  const [showDeleteDependentModal, setShowDeleteDependentModal] =
    useState(false);
  const [dependentToDelete, setDependentToDelete] = useState<Dependent | null>(
    null
  );

  // Fetch dependents when client changes
  useEffect(() => {
    const fetchDependents = async () => {
      if (client?.id) {
        setLoadingDependents(true);
        try {
          const clientDependents = await getDependents(client.id.toString());
          setDependents(clientDependents || []);
        } catch (error) {
          console.error("Error fetching dependents:", error);
          setDependents([]);
        } finally {
          setLoadingDependents(false);
        }
      }
    };

    fetchDependents();
  }, [client?.id]);

  const handleDependentAdded = async () => {
    // Refresh the dependents list after adding a new one
    if (client?.id) {
      setLoadingDependents(true);
      try {
        const clientDependents = await getDependents(client.id.toString());
        setDependents(clientDependents || []);
      } catch (error) {
        console.error("Error fetching updated dependents:", error);
      } finally {
        setLoadingDependents(false);
      }
    }
  };

  const handleClientUpdated = () => {
    if (onClientUpdated) {
      onClientUpdated();
    }
  };

  const handleDeleteClient = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteClient(client.id);
      if (result && result.success) {
        if (onClientDeleted) {
          onClientDeleted();
        }
        setShowDeleteClientModal(false);
      } else {
        alert("Erro ao excluir cliente. Tente novamente.");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Erro interno. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClientConfirm = () => {
    setShowDeleteClientModal(true);
  };

  const handleEditDependent = (dependent: Dependent) => {
    setSelectedDependent(dependent);
    setShowEditDependentModal(true);
  };

  const handleDeleteDependent = async () => {
    if (!dependentToDelete) return;

    try {
      const result = await deleteDependent(dependentToDelete.id);
      if (result && result.success) {
        // Refresh the dependents list
        handleDependentAdded();
        setShowDeleteDependentModal(false);
        setDependentToDelete(null);
      } else {
        alert("Erro ao excluir dependente. Tente novamente.");
      }
    } catch (error) {
      console.error("Error deleting dependent:", error);
      alert("Erro interno. Tente novamente.");
    }
  };

  const handleDeleteDependentConfirm = (dependent: Dependent) => {
    setDependentToDelete(dependent);
    setShowDeleteDependentModal(true);
  };

  const handleDependentUpdated = () => {
    // Refresh the dependents list after updating
    handleDependentAdded();
  };

  // Additional debugging for the formatted date
  if (client.birthdate) {
    const birthdateStr = String(client.birthdate);
    if (birthdateStr.includes("T")) {
      const datePart = birthdateStr.split("T")[0];
      const [year, month, day] = datePart.split("-").map(Number);
    }
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Não informado";

    // Handle different date formats
    let dateObj: Date;
    if (typeof date === "string") {
      // Check if it's an ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss...)
      const isoDatePattern = /^\d{4}-\d{2}-\d{2}/;
      if (isoDatePattern.test(date)) {
        // Extract just the date part (YYYY-MM-DD) and create a local date
        const datePart = date.split("T")[0];
        const [year, month, day] = datePart.split("-").map(Number);
        dateObj = new Date(year, month - 1, day); // month is 0-based
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = new Date(date);
    }

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Data inválida";
    }

    const formatted = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);

    return formatted;
  };

  const getAge = (birthdate: Date | string | undefined) => {
    if (!birthdate) return "Não informado";

    // Handle different date formats
    let birth: Date;
    if (typeof birthdate === "string") {
      // Check if it's an ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss...)
      const isoDatePattern = /^\d{4}-\d{2}-\d{2}/;
      if (isoDatePattern.test(birthdate)) {
        // Extract just the date part (YYYY-MM-DD) and create a local date
        const datePart = birthdate.split("T")[0];
        const [year, month, day] = datePart.split("-").map(Number);
        birth = new Date(year, month - 1, day); // month is 0-based
      } else {
        birth = new Date(birthdate);
      }
    } else {
      birth = new Date(birthdate);
    }

    // Check if date is valid
    if (isNaN(birth.getTime())) {
      return "Data inválida";
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatPhoneNumber = (phone: string | undefined) => {
    // Format Brazilian phone number (11) 99999-9999
    if (!phone) return "Não informado";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7
      )}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return phone;
  };

  const getDependentAge = (birthdate: string | undefined) => {
    if (!birthdate) return "Não informado";

    // Handle different date formats
    let birth: Date;
    if (typeof birthdate === "string") {
      // Check if it's an ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss...)
      const isoDatePattern = /^\d{4}-\d{2}-\d{2}/;
      if (isoDatePattern.test(birthdate)) {
        // Extract just the date part (YYYY-MM-DD) and create a local date
        const datePart = birthdate.split("T")[0];
        const [year, month, day] = datePart.split("-").map(Number);
        birth = new Date(year, month - 1, day); // month is 0-based
      } else {
        birth = new Date(birthdate);
      }
    } else {
      birth = new Date(birthdate);
    }

    // Check if date is valid
    if (isNaN(birth.getTime())) {
      return "Data inválida";
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="client-details">
      <div className="client-details__header">
        <div className="client-details__avatar">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div className="client-details__header-info">
          <h1 className="client-details__name">{client.name}</h1>
          <div className="client-details__basic-info">
            <span className="client-details__gender">
              {client.gender || "Não informado"}
            </span>
            <span className="client-details__separator">•</span>
            <span className="client-details__age">
              {typeof getAge(client.birthdate) === "string"
                ? getAge(client.birthdate)
                : `${getAge(client.birthdate)} anos`}
            </span>
            <span className="client-details__separator">•</span>
            <span className="client-details__profession">
              {client.profession || "Não informado"}
            </span>
          </div>
        </div>
      </div>

      <div className="client-details__content">
        <div className="client-details__section">
          <h3 className="client-details__section-title">
            Informações Pessoais
          </h3>
          <div className="client-details__section-content">
            <div className="client-details__info-grid">
              <div className="client-details__info-item">
                <span className="client-details__info-label">Email</span>
                <span className="client-details__info-value">
                  {client.email || "Não informado"}
                </span>
              </div>
              <div className="client-details__info-item">
                <span className="client-details__info-label">Telefone</span>
                <span className="client-details__info-value">
                  {formatPhoneNumber(client.phonenumber)}
                </span>
              </div>
              <div className="client-details__info-item">
                <span className="client-details__info-label">
                  Data de Nascimento
                </span>
                <span className="client-details__info-value">
                  {formatDate(client.birthdate)}
                </span>
              </div>
              <div className="client-details__info-item">
                <span className="client-details__info-label">Estado Civil</span>
                <span className="client-details__info-value">
                  {client.maritalstatus || "Não informado"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="client-details__section">
          <h3 className="client-details__section-title">Endereço</h3>
          <div className="client-details__section-content">
            {client.address ||
            client.addressnumber ||
            client.addresscomplement ? (
              <div className="client-details__address">
                {client.address && (
                  <span className="client-details__address-street">
                    {client.address}
                    {client.addressnumber && `, ${client.addressnumber}`}
                  </span>
                )}
                {client.addresscomplement && (
                  <span className="client-details__address-complement">
                    {client.addresscomplement}
                  </span>
                )}
              </div>
            ) : (
              <div className="client-details__address">
                <span className="client-details__address-street">
                  Endereço não informado
                </span>
              </div>
            )}
          </div>
        </div>

        {(client.partnerName ||
          client.partnerEmail ||
          client.partnerPhoneNumber) && (
          <div className="client-details__section">
            <h3 className="client-details__section-title">
              Informações do Cônjuge
            </h3>
            <div className="client-details__section-content">
              <div className="client-details__info-grid">
                {client.partnerName && (
                  <div className="client-details__info-item">
                    <span className="client-details__info-label">Nome</span>
                    <span className="client-details__info-value">
                      {client.partnerName}
                    </span>
                  </div>
                )}
                {client.partnerEmail && (
                  <div className="client-details__info-item">
                    <span className="client-details__info-label">Email</span>
                    <span className="client-details__info-value">
                      {client.partnerEmail}
                    </span>
                  </div>
                )}
                {client.partnerPhoneNumber && (
                  <div className="client-details__info-item">
                    <span className="client-details__info-label">Telefone</span>
                    <span className="client-details__info-value">
                      {formatPhoneNumber(client.partnerPhoneNumber)}
                    </span>
                  </div>
                )}
                {client.partnerGender && (
                  <div className="client-details__info-item">
                    <span className="client-details__info-label">Gênero</span>
                    <span className="client-details__info-value">
                      {client.partnerGender}
                    </span>
                  </div>
                )}
                {client.partnerProfession && (
                  <div className="client-details__info-item">
                    <span className="client-details__info-label">
                      Profissão
                    </span>
                    <span className="client-details__info-value">
                      {client.partnerProfession}
                    </span>
                  </div>
                )}
                {client.partnerBirthDate && (
                  <div className="client-details__info-item">
                    <span className="client-details__info-label">
                      Data de Nascimento
                    </span>
                    <span className="client-details__info-value">
                      {formatDate(client.partnerBirthDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="client-details__section">
          <div className="client-details__section-header">
            <h3 className="">Dependentes</h3>
            <button
              className="client-details__add-dependent-button"
              onClick={() => setShowAddDependentModal(true)}
              title="Adicionar dependente"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Dependente
            </button>
          </div>
          <div className="client-details__section-content">
            {loadingDependents ? (
              <div className="client-details__loading">
                <span>Carregando dependentes...</span>
              </div>
            ) : dependents.length > 0 ? (
              <div className="client-details__dependents">
                {dependents.map((dependent) => (
                  <div
                    key={dependent.id}
                    className="client-details__dependent-card"
                  >
                    <div className="client-details__dependent-header">
                      <div className="client-details__dependent-avatar">
                        {dependent.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="client-details__dependent-info">
                        <h4 className="client-details__dependent-name">
                          {dependent.name}
                        </h4>
                        <div className="client-details__dependent-meta">
                          <span className="client-details__dependent-type">
                            {dependent.type}
                          </span>
                          {dependent.gender && (
                            <>
                              <span className="client-details__separator">
                                •
                              </span>
                              <span className="client-details__dependent-gender">
                                {dependent.gender}
                              </span>
                            </>
                          )}
                          {dependent.birthdate && (
                            <>
                              <span className="client-details__separator">
                                •
                              </span>
                              <span className="client-details__dependent-age">
                                {typeof getDependentAge(dependent.birthdate) ===
                                "string"
                                  ? getDependentAge(dependent.birthdate)
                                  : `${getDependentAge(
                                      dependent.birthdate
                                    )} anos`}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="client-details__dependent-details">
                      {dependent.email && (
                        <div className="client-details__dependent-detail">
                          <span className="client-details__dependent-detail-label">
                            Email:
                          </span>
                          <span className="client-details__dependent-detail-value">
                            {dependent.email}
                          </span>
                        </div>
                      )}
                      {dependent.phonenumber && (
                        <div className="client-details__dependent-detail">
                          <span className="client-details__dependent-detail-label">
                            Telefone:
                          </span>
                          <span className="client-details__dependent-detail-value">
                            {formatPhoneNumber(dependent.phonenumber)}
                          </span>
                        </div>
                      )}
                      {dependent.birthdate && (
                        <div className="client-details__dependent-detail">
                          <span className="client-details__dependent-detail-label">
                            Data de Nascimento:
                          </span>
                          <span className="client-details__dependent-detail-value">
                            {formatDate(dependent.birthdate)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="client-details__dependent-actions">
                      <button
                        onClick={() => handleEditDependent(dependent)}
                        className="client-details__dependent-action-button client-details__dependent-action-button--edit"
                        title="Editar dependente"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteDependentConfirm(dependent)}
                        className="client-details__dependent-action-button client-details__dependent-action-button--delete"
                        title="Excluir dependente"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3,6 5,6 21,6" />
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="client-details__no-dependents">
                <p>Este cliente não possui dependentes cadastrados.</p>
              </div>
            )}
          </div>
        </div>

        <div className="client-details__section">
          <h3 className="client-details__section-title">Ações</h3>
          <div className="client-details__section-content">
            <div className="client-details__actions">
              <button className="client-details__action-button client-details__action-button--primary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Novo Relatório
              </button>
              <button
                className="client-details__action-button client-details__action-button--secondary"
                onClick={() => setShowEditClientModal(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar Cliente
              </button>
              <button className="client-details__action-button client-details__action-button--secondary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
                Ver Relatórios
              </button>
              <button
                className="client-details__action-button client-details__action-button--danger"
                onClick={handleDeleteClientConfirm}
                disabled={isDeleting}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3,6 5,6 21,6" />
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                {isDeleting ? "Excluindo..." : "Excluir Cliente"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Dependent Modal */}
      <AddDependent
        isOpen={showAddDependentModal}
        onClose={() => setShowAddDependentModal(false)}
        clientId={client.id}
        onDependentAdded={handleDependentAdded}
      />

      {/* Edit Client Modal */}
      <EditClient
        isOpen={showEditClientModal}
        onClose={() => setShowEditClientModal(false)}
        client={client}
        onClientUpdated={handleClientUpdated}
      />

      {/* Edit Dependent Modal */}
      <EditDependent
        isOpen={showEditDependentModal}
        onClose={() => {
          setShowEditDependentModal(false);
          setSelectedDependent(null);
        }}
        dependent={selectedDependent}
        onDependentUpdated={handleDependentUpdated}
      />

      {/* Delete Client Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteClientModal}
        onClose={() => setShowDeleteClientModal(false)}
        onConfirm={handleDeleteClient}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita e também excluirá todos os dependentes associados."
        isDeleting={isDeleting}
      />

      {/* Delete Dependent Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteDependentModal}
        onClose={() => {
          setShowDeleteDependentModal(false);
          setDependentToDelete(null);
        }}
        onConfirm={handleDeleteDependent}
        title="Excluir Dependente"
        message={`Tem certeza que deseja excluir o dependente "${dependentToDelete?.name}"? Esta ação não pode ser desfeita.`}
        isDeleting={false}
      />
    </div>
  );
}
