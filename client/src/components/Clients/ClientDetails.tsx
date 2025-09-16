import React from "react";
import { Client } from "../../models/Client";

interface ClientDetailsProps {
  client: Client;
}

export default function ClientDetails({ client }: ClientDetailsProps) {
  // Debug: Log the client data to see the birth date format
  console.log("Client data:", client);
  console.log(
    "Birth date:",
    client.birthdate,
    "Type:",
    typeof client.birthdate
  );

  // Additional debugging for the formatted date
  if (client.birthdate) {
    console.log("Original birthdate:", client.birthdate);
    console.log("Formatted birthdate:", new Date(client.birthdate).toString());
    const birthdateStr = String(client.birthdate);
    if (birthdateStr.includes("T")) {
      const datePart = birthdateStr.split("T")[0];
      const [year, month, day] = datePart.split("-").map(Number);
      console.log(
        "Local date (no timezone):",
        new Date(year, month - 1, day).toString()
      );
    }
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Não informado";

    console.log("formatDate input:", date, "type:", typeof date);

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
        console.log("Parsed as local date:", dateObj.toString());
      } else {
        dateObj = new Date(date);
        console.log("Parsed as standard date:", dateObj.toString());
      }
    } else {
      dateObj = new Date(date);
      console.log("Converted Date object:", dateObj.toString());
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

    console.log("Final formatted date:", formatted);
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
              <button className="client-details__action-button client-details__action-button--secondary">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
