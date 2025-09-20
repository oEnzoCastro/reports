import React, { useState } from "react";
import { Dependent } from "../../models/Client";
import { postDependent } from "../../services/db";

interface AddDependentProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  onDependentAdded: () => void;
}

export default function AddDependent({
  isOpen,
  onClose,
  clientId,
  onDependentAdded,
}: AddDependentProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    birthdate: "",
    phonenumber: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dependentTypes = [
    "Filho(a)",
    "Cônjuge",
    "Pai/Mãe",
    "Irmão/Irmã",
    "Avô/Avó",
    "Neto(a)",
    "Outro",
  ];

  const genderOptions = [
    { value: "Masculino", label: "Masculino" },
    { value: "Feminino", label: "Feminino" },
    { value: "Outro", label: "Outro" },
  ];

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

    if (!formData.gender) {
      newErrors.gender = "Gênero é obrigatório";
    }

    if (!formData.type) {
      newErrors.type = "Tipo de dependente é obrigatório";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email deve ter um formato válido";
    }

    if (
      formData.phonenumber &&
      !/^\d{10,11}$/.test(formData.phonenumber.replace(/\D/g, ""))
    ) {
      newErrors.phonenumber = "Telefone deve ter 10 ou 11 dígitos";
    }

    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthdate = "Data de nascimento não pode ser no futuro";
      }
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
      const dependentData = {
        ...formData,
        clientid: clientId,
      };

      const result = await postDependent(dependentData);

      if (result) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          gender: "",
          birthdate: "",
          phonenumber: "",
          type: "",
        });
        setErrors({});
        onDependentAdded();
        onClose();
      } else {
        setErrors({ submit: "Erro ao adicionar dependente. Tente novamente." });
      }
    } catch (error) {
      console.error("Error adding dependent:", error);
      setErrors({ submit: "Erro ao adicionar dependente. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        email: "",
        gender: "",
        birthdate: "",
        phonenumber: "",
        type: "",
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Adicionar Dependente</h2>
          <button
            className="modal-close-button"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <svg
              width="24"
              height="24"
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

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nome *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.name ? "form-input--error" : ""
                }`}
                placeholder="Nome do dependente"
                disabled={isSubmitting}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Tipo de Dependente *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.type ? "form-input--error" : ""
                }`}
                disabled={isSubmitting}
              >
                <option value="">Selecione o tipo</option>
                {dependentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && <span className="form-error">{errors.type}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gênero *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.gender ? "form-input--error" : ""
                }`}
                disabled={isSubmitting}
              >
                <option value="">Selecione o gênero</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <span className="form-error">{errors.gender}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="birthdate" className="form-label">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.birthdate ? "form-input--error" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.birthdate && (
                <span className="form-error">{errors.birthdate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.email ? "form-input--error" : ""
                }`}
                placeholder="email@exemplo.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phonenumber" className="form-label">
                Telefone
              </label>
              <input
                type="tel"
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.phonenumber ? "form-input--error" : ""
                }`}
                placeholder="(11) 99999-9999"
                disabled={isSubmitting}
              />
              {errors.phonenumber && (
                <span className="form-error">{errors.phonenumber}</span>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="form-error form-error--general">
              {errors.submit}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adicionando..." : "Adicionar Dependente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
