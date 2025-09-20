import React, { useState, useEffect } from "react";
import { Client } from "../../models/Client";
import { updateClient } from "../../services/db";

interface EditClientProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onClientUpdated: () => void;
}

export default function EditClient({
  isOpen,
  onClose,
  client,
  onClientUpdated,
}: EditClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
    phonenumber: "",
    gender: "",
    birthdate: "",
    maritalstatus: "",
    address: "",
    addressnumber: "",
    addresscomplement: "",
    partnerName: "",
    partnerEmail: "",
    partnerPhoneNumber: "",
    partnerGender: "",
    partnerProfession: "",
    partnerBirthDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions = [
    { value: "Masculino", label: "Masculino" },
    { value: "Feminino", label: "Feminino" },
    { value: "Outro", label: "Outro" },
  ];

  const maritalStatusOptions = [
    { value: "Solteiro(a)", label: "Solteiro(a)" },
    { value: "Casado(a)", label: "Casado(a)" },
    { value: "Divorciado(a)", label: "Divorciado(a)" },
    { value: "Viúvo(a)", label: "Viúvo(a)" },
    { value: "União Estável", label: "União Estável" },
  ];

  // Initialize form data when client changes
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        profession: client.profession || "",
        phonenumber: client.phonenumber || "",
        gender: client.gender || "",
        birthdate: client.birthdate
          ? new Date(client.birthdate).toISOString().split("T")[0]
          : "",
        maritalstatus: client.maritalstatus || "",
        address: client.address || "",
        addressnumber: client.addressnumber || "",
        addresscomplement: client.addresscomplement || "",
        partnerName: client.partnerName || "",
        partnerEmail: client.partnerEmail || "",
        partnerPhoneNumber: client.partnerPhoneNumber || "",
        partnerGender: client.partnerGender || "",
        partnerProfession: client.partnerProfession || "",
        partnerBirthDate: client.partnerBirthDate
          ? new Date(client.partnerBirthDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [client]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.profession.trim()) {
      newErrors.profession = "Profissão é obrigatória";
    }

    if (!formData.phonenumber.trim()) {
      newErrors.phonenumber = "Telefone é obrigatório";
    }

    if (!formData.gender) {
      newErrors.gender = "Gênero é obrigatório";
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Data de nascimento é obrigatória";
    }

    if (!formData.maritalstatus) {
      newErrors.maritalstatus = "Estado civil é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData = {
        name: formData.name,
        email: formData.email,
        profession: formData.profession,
        phonenumber: formData.phonenumber,
        gender: formData.gender,
        birthdate: formData.birthdate,
        maritalstatus: formData.maritalstatus,
        address: formData.address,
        addressnumber: formData.addressnumber,
        addresscomplement: formData.addresscomplement,
        partnername: formData.partnerName,
        partneremail: formData.partnerEmail,
        partnerphonenumber: formData.partnerPhoneNumber,
        partnergender: formData.partnerGender,
        partnerprofession: formData.partnerProfession,
        partnerbirthdate: formData.partnerBirthDate || null,
      };

      const result = await updateClient(client.id, clientData);

      if (result && result.success) {
        onClientUpdated();
        onClose();
      } else {
        setErrors({ submit: "Erro ao atualizar cliente. Tente novamente." });
      }
    } catch (error) {
      console.error("Error updating client:", error);
      setErrors({ submit: "Erro interno. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the overlay itself, not its children
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ maxWidth: "800px" }}>
        <div className="modal-header">
          <h2 className="modal-title">Editar Cliente</h2>
          <button onClick={handleClose} className="modal-close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3 className="form-section-title">Informações Pessoais</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.name ? "form-input--error" : ""
                  }`}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.email ? "form-input--error" : ""
                  }`}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Profissão *</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.profession ? "form-input--error" : ""
                  }`}
                />
                {errors.profession && (
                  <p className="form-error">{errors.profession}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Telefone *</label>
                <input
                  type="tel"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.phonenumber ? "form-input--error" : ""
                  }`}
                />
                {errors.phonenumber && (
                  <p className="form-error">{errors.phonenumber}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Gênero *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.gender ? "form-input--error" : ""
                  }`}
                >
                  <option value="">Selecione o gênero</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.gender && <p className="form-error">{errors.gender}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Data de Nascimento *</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.birthdate ? "form-input--error" : ""
                  }`}
                />
                {errors.birthdate && (
                  <p className="form-error">{errors.birthdate}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Estado Civil *</label>
                <select
                  name="maritalstatus"
                  value={formData.maritalstatus}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.maritalstatus ? "form-input--error" : ""
                  }`}
                >
                  <option value="">Selecione o estado civil</option>
                  {maritalStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.maritalstatus && (
                  <p className="form-error">{errors.maritalstatus}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h3 className="form-section-title">Endereço</h3>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Endereço</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Número</label>
                <input
                  type="text"
                  name="addressnumber"
                  value={formData.addressnumber}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Complemento</label>
                <input
                  type="text"
                  name="addresscomplement"
                  value={formData.addresscomplement}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Partner Information */}
          <div className="form-section">
            <h3 className="form-section-title">
              Informações do Cônjuge/Parceiro(a)
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nome do Parceiro(a)</label>
                <input
                  type="text"
                  name="partnerName"
                  value={formData.partnerName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email do Parceiro(a)</label>
                <input
                  type="email"
                  name="partnerEmail"
                  value={formData.partnerEmail}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefone do Parceiro(a)</label>
                <input
                  type="tel"
                  name="partnerPhoneNumber"
                  value={formData.partnerPhoneNumber}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gênero do Parceiro(a)</label>
                <select
                  name="partnerGender"
                  value={formData.partnerGender}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Selecione o gênero</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Profissão do Parceiro(a)</label>
                <input
                  type="text"
                  name="partnerProfession"
                  value={formData.partnerProfession}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Data de Nascimento do Parceiro(a)
                </label>
                <input
                  type="date"
                  name="partnerBirthDate"
                  value={formData.partnerBirthDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="form-error--general">{errors.submit}</div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn--secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn--primary"
            >
              {isSubmitting ? "Atualizando..." : "Atualizar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
