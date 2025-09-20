import React, { useState, useEffect } from "react";
import { Dependent } from "../../models/Client";
import { updateDependent } from "../../services/db";

interface EditDependentProps {
  isOpen: boolean;
  onClose: () => void;
  dependent: Dependent | null;
  onDependentUpdated: () => void;
}

export default function EditDependent({
  isOpen,
  onClose,
  dependent,
  onDependentUpdated,
}: EditDependentProps) {
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

  // Initialize form data when dependent changes
  useEffect(() => {
    if (dependent) {
      setFormData({
        name: dependent.name || "",
        email: dependent.email || "",
        gender: dependent.gender || "",
        birthdate: dependent.birthdate || "",
        phonenumber: dependent.phonenumber || "",
        type: dependent.type || "",
      });
    }
  }, [dependent]);

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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.gender) {
      newErrors.gender = "Gênero é obrigatório";
    }

    if (!formData.type) {
      newErrors.type = "Tipo de dependente é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !dependent) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dependentData = {
        name: formData.name,
        email: formData.email || null,
        gender: formData.gender,
        birthdate: formData.birthdate || null,
        phonenumber: formData.phonenumber || null,
        type: formData.type,
      };

      const result = await updateDependent(dependent.id, dependentData);

      if (result && result.success) {
        onDependentUpdated();
        onClose();
      } else {
        setErrors({ submit: "Erro ao atualizar dependente. Tente novamente." });
      }
    } catch (error) {
      console.error("Error updating dependent:", error);
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

  if (!isOpen || !dependent) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Editar Dependente</h2>
          <button onClick={handleClose} className="modal-close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
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
                placeholder="Digite o nome do dependente"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.email ? "form-input--error" : ""
                }`}
                placeholder="Digite o email (opcional)"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
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
              <label className="form-label">Data de Nascimento</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite o telefone (opcional)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Dependente *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.type ? "form-input--error" : ""
                }`}
              >
                <option value="">Selecione o tipo</option>
                {dependentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && <p className="form-error">{errors.type}</p>}
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
              {isSubmitting ? "Atualizando..." : "Atualizar Dependente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
