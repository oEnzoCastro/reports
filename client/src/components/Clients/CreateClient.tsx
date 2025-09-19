"use client";

import { useState, useEffect } from "react";
import { ArrowRightIcon, ArrowLeftIcon, PlusIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { postClient, postDependent } from "@/services/db";

// Types for form data
interface Dependent {
  id: string;
  name: string;
  email?: string;
  gender: string;
  birthdate?: string;
  phoneNumber?: string;
  type: string;
}

interface ClientFormData {
  // Basic information
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  profession: string;
  birthdate: string;
  maritalStatus: string;

  // Optional address information
  address?: string;
  addressNumber?: string;
  addressComplement?: string;

  // Partner information
  hasPartner: boolean;
  partnerName?: string;
  partnerEmail?: string;
  partnerPhoneNumber?: string;
  partnerGender?: string;
  partnerProfession?: string;
  partnerBirthdate?: string;

  // Dependents
  dependents: Dependent[];
}

const initialFormData: ClientFormData = {
  name: "",
  email: "",
  phoneNumber: "",
  gender: "",
  profession: "",
  birthdate: "",
  maritalStatus: "",
  address: "",
  addressNumber: "",
  addressComplement: "",
  hasPartner: false,
  partnerName: "",
  partnerEmail: "",
  partnerPhoneNumber: "",
  partnerGender: "",
  partnerProfession: "",
  partnerBirthdate: "",
  dependents: [],
};

interface CreateClientProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated?: () => void;
}

export default function CreateClient({
  isOpen,
  onClose,
  onClientCreated,
}: CreateClientProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorPopup, setErrorPopup] = useState<string | null>(null);

  // Auto-dismiss error popup after 5 seconds
  useEffect(() => {
    if (errorPopup) {
      const timer = setTimeout(() => {
        setErrorPopup(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorPopup]);

  const stepContent = [
    {
      title: "Informações Básicas",
      description: "Preencha as informações principais do cliente.",
    },
    {
      title: "Endereço (Opcional)",
      description: "Adicione as informações de endereço do cliente.",
    },
    {
      title: "Informações do Cônjuge",
      description: "Adicione as informações do parceiro/cônjuge, se aplicável.",
    },
    {
      title: "Dependentes",
      description: "Adicione os dependentes do cliente.",
    },
  ];

  const totalSteps = stepContent.length;

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addDependent = () => {
    const newDependent: Dependent = {
      id: Date.now().toString(),
      name: "",
      email: "",
      gender: "",
      birthdate: "",
      phoneNumber: "",
      type: "",
    };
    setFormData((prev) => ({
      ...prev,
      dependents: [...prev.dependents, newDependent],
    }));
  };

  const updateDependent = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.map((dep) =>
        dep.id === id ? { ...dep, [field]: value } : dep
      ),
    }));
  };

  const removeDependent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((dep) => dep.id !== id),
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
      if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email inválido";
      }
      if (!formData.phoneNumber.trim())
        newErrors.phoneNumber = "Telefone é obrigatório";
      if (!formData.gender) newErrors.gender = "Gênero é obrigatório";
      if (!formData.profession.trim())
        newErrors.profession = "Profissão é obrigatória";
      if (!formData.birthdate)
        newErrors.birthdate = "Data de nascimento é obrigatória";
      if (!formData.maritalStatus)
        newErrors.maritalStatus = "Estado civil é obrigatório";
    }

    if (currentStep === 3 && formData.hasPartner) {
      if (!formData.partnerName?.trim())
        newErrors.partnerName = "Nome do parceiro é obrigatório";
      if (!formData.partnerEmail?.trim())
        newErrors.partnerEmail = "Email do parceiro é obrigatório";
      if (
        formData.partnerEmail &&
        !/\S+@\S+\.\S+/.test(formData.partnerEmail)
      ) {
        newErrors.partnerEmail = "Email do parceiro inválido";
      }
      if (!formData.partnerPhoneNumber?.trim())
        newErrors.partnerPhoneNumber = "Telefone do parceiro é obrigatório";
      if (!formData.partnerGender)
        newErrors.partnerGender = "Gênero do parceiro é obrigatório";
      if (!formData.partnerProfession?.trim())
        newErrors.partnerProfession = "Profissão do parceiro é obrigatória";
      if (!formData.partnerBirthdate)
        newErrors.partnerBirthdate =
          "Data de nascimento do parceiro é obrigatória";
    }

    if (currentStep === 4) {
      // Validate dependents - each dependent must have at least name, gender, and type
      formData.dependents.forEach((dependent, index) => {
        if (!dependent.name.trim()) {
          newErrors[`dependent_${index}_name`] = `Nome do dependente ${
            index + 1
          } é obrigatório`;
        }
        if (!dependent.gender) {
          newErrors[`dependent_${index}_gender`] = `Gênero do dependente ${
            index + 1
          } é obrigatório`;
        }
        if (!dependent.type) {
          newErrors[`dependent_${index}_type`] = `Tipo do dependente ${
            index + 1
          } é obrigatório`;
        }
        if (dependent.email && !/\S+@\S+\.\S+/.test(dependent.email)) {
          newErrors[`dependent_${index}_email`] = `Email do dependente ${
            index + 1
          } é inválido`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      try {
        // Transform form data to match the expected Client type
        const clientData = {
          name: formData.name,
          email: formData.email,
          phonenumber: formData.phoneNumber,
          gender: formData.gender,
          profession: formData.profession,
          birthdate: new Date(formData.birthdate),
          maritalstatus: formData.maritalStatus,
          address: formData.address || undefined,
          addressnumber: formData.addressNumber || undefined,
          addresscomplement: formData.addressComplement || undefined,
          partnername: formData.hasPartner ? formData.partnerName : undefined,
          partneremail: formData.hasPartner ? formData.partnerEmail : undefined,
          partnerphonenumber: formData.hasPartner
            ? formData.partnerPhoneNumber
            : undefined,
          partnergender: formData.hasPartner
            ? formData.partnerGender
            : undefined,
          partnerprofession: formData.hasPartner
            ? formData.partnerProfession
            : undefined,
          partnerbirthdate:
            formData.hasPartner && formData.partnerBirthdate
              ? new Date(formData.partnerBirthdate)
              : undefined,
        };

        // Here you would typically send the data to your API
        console.log(clientData);
        const clientResult = await postClient(clientData);

        // Check if client creation was successful
        if (!clientResult || !clientResult.clientId) {
          setErrorPopup("Failed to create client - no client ID returned");
          // Reset form and close dialog even on error
          setFormData(initialFormData);
          setStep(1);
          setErrors({});
          onClose();
          return;
        }

        // Process dependents if any exist
        if (formData.dependents.length > 0) {
          for (const dependent of formData.dependents) {
            const dependentData = {
              name: dependent.name,
              email: dependent.email || undefined,
              phonenumber: dependent.phoneNumber || undefined,
              gender: dependent.gender || undefined,
              birthdate: dependent.birthdate
                ? new Date(dependent.birthdate)
                : undefined,
              type: dependent.type || undefined,
              clientid: clientResult.clientId,
            };

            await postDependent(dependentData);
          }
        }

        // Reset form and close dialog
        setFormData(initialFormData);
        setStep(1);
        setErrors({});
        onClose();

        // Call the callback to refresh the client list
        onClientCreated?.();
      } catch (error) {
        console.error("Error creating client:", error);
        setErrorPopup("Erro ao criar cliente. Tente novamente.");
        // Reset form and close dialog even on error
        setFormData(initialFormData);
        setStep(1);
        setErrors({});
        onClose();
      }
    }
  };

  const renderStep1 = () => (
    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          className={`form-input ${errors.name ? "form-input--error" : ""}`}
          placeholder="Nome completo"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          className={`form-input ${errors.email ? "form-input--error" : ""}`}
          placeholder="email@exemplo.com"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          Telefone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => updateFormData("phoneNumber", e.target.value)}
          className={`form-input ${
            errors.phoneNumber ? "form-input--error" : ""
          }`}
          placeholder="(11) 99999-9999"
        />
        {errors.phoneNumber && (
          <span className="form-error">{errors.phoneNumber}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Gênero <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.gender}
          onChange={(e) => updateFormData("gender", e.target.value)}
          className={`form-input ${errors.gender ? "form-input--error" : ""}`}
        >
          <option value="">Selecione</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
          <option value="prefiro-nao-informar">Prefiro não informar</option>
        </select>
        {errors.gender && <span className="form-error">{errors.gender}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          Profissão <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.profession}
          onChange={(e) => updateFormData("profession", e.target.value)}
          className={`form-input ${
            errors.profession ? "form-input--error" : ""
          }`}
          placeholder="Profissão"
        />
        {errors.profession && (
          <span className="form-error">{errors.profession}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Data de Nascimento <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.birthdate}
          onChange={(e) => updateFormData("birthdate", e.target.value)}
          className={`form-input ${
            errors.birthdate ? "form-input--error" : ""
          }`}
        />
        {errors.birthdate && (
          <span className="form-error">{errors.birthdate}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Estado Civil <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.maritalStatus}
          onChange={(e) => updateFormData("maritalStatus", e.target.value)}
          className={`form-input ${
            errors.maritalStatus ? "form-input--error" : ""
          }`}
        >
          <option value="">Selecione</option>
          <option value="solteiro">Solteiro(a)</option>
          <option value="casado">Casado(a)</option>
          <option value="divorciado">Divorciado(a)</option>
          <option value="viuvo">Viúvo(a)</option>
          <option value="uniao-estavel">União Estável</option>
        </select>
        {errors.maritalStatus && (
          <span className="form-error">{errors.maritalStatus}</span>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-grid">
      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
        <label className="form-label">Endereço</label>
        <input
          type="text"
          value={formData.address || ""}
          onChange={(e) => updateFormData("address", e.target.value)}
          className="form-input"
          placeholder="Rua, Avenida, etc."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Número</label>
        <input
          type="text"
          value={formData.addressNumber || ""}
          onChange={(e) => updateFormData("addressNumber", e.target.value)}
          className="form-input"
          placeholder="123"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Complemento</label>
        <input
          type="text"
          value={formData.addressComplement || ""}
          onChange={(e) => updateFormData("addressComplement", e.target.value)}
          className="form-input"
          placeholder="Apto, Bloco, etc."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <div className="form-group" style={{ marginBottom: "24px" }}>
        <label
          className="form-label"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <input
            type="checkbox"
            id="hasPartner"
            checked={formData.hasPartner}
            onChange={(e) => updateFormData("hasPartner", e.target.checked)}
            style={{ margin: 0 }}
          />
          Cliente possui cônjuge/parceiro
        </label>
      </div>

      {formData.hasPartner && (
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Nome do Parceiro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.partnerName || ""}
              onChange={(e) => updateFormData("partnerName", e.target.value)}
              className={`form-input ${
                errors.partnerName ? "form-input--error" : ""
              }`}
              placeholder="Nome completo"
            />
            {errors.partnerName && (
              <span className="form-error">{errors.partnerName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Email do Parceiro <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.partnerEmail || ""}
              onChange={(e) => updateFormData("partnerEmail", e.target.value)}
              className={`form-input ${
                errors.partnerEmail ? "form-input--error" : ""
              }`}
              placeholder="email@exemplo.com"
            />
            {errors.partnerEmail && (
              <span className="form-error">{errors.partnerEmail}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Telefone do Parceiro <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.partnerPhoneNumber || ""}
              onChange={(e) =>
                updateFormData("partnerPhoneNumber", e.target.value)
              }
              className={`form-input ${
                errors.partnerPhoneNumber ? "form-input--error" : ""
              }`}
              placeholder="(11) 99999-9999"
            />
            {errors.partnerPhoneNumber && (
              <span className="form-error">{errors.partnerPhoneNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Gênero do Parceiro <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.partnerGender || ""}
              onChange={(e) => updateFormData("partnerGender", e.target.value)}
              className={`form-input ${
                errors.partnerGender ? "form-input--error" : ""
              }`}
            >
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
              <option value="prefiro-nao-informar">Prefiro não informar</option>
            </select>
            {errors.partnerGender && (
              <span className="form-error">{errors.partnerGender}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Profissão do Parceiro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.partnerProfession || ""}
              onChange={(e) =>
                updateFormData("partnerProfession", e.target.value)
              }
              className={`form-input ${
                errors.partnerProfession ? "form-input--error" : ""
              }`}
              placeholder="Profissão"
            />
            {errors.partnerProfession && (
              <span className="form-error">{errors.partnerProfession}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Data de Nascimento do Parceiro{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.partnerBirthdate || ""}
              onChange={(e) =>
                updateFormData("partnerBirthdate", e.target.value)
              }
              className={`form-input ${
                errors.partnerBirthdate ? "form-input--error" : ""
              }`}
            />
            {errors.partnerBirthdate && (
              <span className="form-error">{errors.partnerBirthdate}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
          Dependentes
        </h3>
        <button
          type="button"
          onClick={addDependent}
          className="btn btn--secondary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <PlusIcon size={16} />
          Adicionar Dependente
        </button>
      </div>

      {formData.dependents.length === 0 ? (
        <p
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            padding: "32px 0",
          }}
        >
          Nenhum dependente adicionado. Clique no botão acima para adicionar.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {formData.dependents.map((dependent, index) => (
            <div
              key={dependent.id}
              style={{
                border: "1px solid var(--border-color)",
                borderRadius: "var(--border-radius-sm)",
                padding: "20px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ fontWeight: "600", margin: 0 }}>
                  Dependente {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeDependent(dependent.id)}
                  className="btn btn--secondary"
                  style={{ color: "#dc3545", borderColor: "#dc3545" }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={dependent.name}
                    onChange={(e) =>
                      updateDependent(dependent.id, "name", e.target.value)
                    }
                    className={`form-input ${
                      errors[`dependent_${index}_name`]
                        ? "form-input--error"
                        : ""
                    }`}
                    placeholder="Nome completo"
                  />
                  {errors[`dependent_${index}_name`] && (
                    <span className="form-error">
                      {errors[`dependent_${index}_name`]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={dependent.email || ""}
                    onChange={(e) =>
                      updateDependent(dependent.id, "email", e.target.value)
                    }
                    className={`form-input ${
                      errors[`dependent_${index}_email`]
                        ? "form-input--error"
                        : ""
                    }`}
                    placeholder="email@exemplo.com"
                  />
                  {errors[`dependent_${index}_email`] && (
                    <span className="form-error">
                      {errors[`dependent_${index}_email`]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Gênero <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dependent.gender}
                    onChange={(e) =>
                      updateDependent(dependent.id, "gender", e.target.value)
                    }
                    className={`form-input ${
                      errors[`dependent_${index}_gender`]
                        ? "form-input--error"
                        : ""
                    }`}
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                    <option value="prefiro-nao-informar">
                      Prefiro não informar
                    </option>
                  </select>
                  {errors[`dependent_${index}_gender`] && (
                    <span className="form-error">
                      {errors[`dependent_${index}_gender`]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    value={dependent.birthdate || ""}
                    onChange={(e) =>
                      updateDependent(dependent.id, "birthdate", e.target.value)
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input
                    type="tel"
                    value={dependent.phoneNumber || ""}
                    onChange={(e) =>
                      updateDependent(
                        dependent.id,
                        "phoneNumber",
                        e.target.value
                      )
                    }
                    className="form-input"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dependent.type}
                    onChange={(e) =>
                      updateDependent(dependent.id, "type", e.target.value)
                    }
                    className={`form-input ${
                      errors[`dependent_${index}_type`]
                        ? "form-input--error"
                        : ""
                    }`}
                  >
                    <option value="">Selecione</option>
                    <option value="filho">Filho(a)</option>
                    <option value="enteado">Enteado(a)</option>
                    <option value="neto">Neto(a)</option>
                    <option value="pai">Pai</option>
                    <option value="mae">Mãe</option>
                    <option value="sogro">Sogro(a)</option>
                    <option value="irmao">Irmão/Irmã</option>
                    <option value="outro">Outro</option>
                  </select>
                  {errors[`dependent_${index}_type`] && (
                    <span className="form-error">
                      {errors[`dependent_${index}_type`]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleClose = () => {
    setFormData(initialFormData);
    setStep(1);
    setErrors({});
    onClose();
  };

  const getCurrentStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{stepContent[step - 1].title}</h2>
          <button className="modal-close-button" onClick={handleClose}>
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

        <div className="modal-form">
          <p className="form-description">
            {stepContent[step - 1].description}
          </p>

          {/* Form Content */}
          <div>{getCurrentStepContent()}</div>

          {/* Progress Indicators and Navigation */}
          <div className="modal-navigation">
            <div className="progress-indicators">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "progress-dot",
                    index + 1 === step ? "progress-dot--active" : ""
                  )}
                />
              ))}
            </div>

            <div className="modal-actions">
              {step > 1 && (
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleBack}
                >
                  <ArrowLeftIcon size={16} />
                  Voltar
                </button>
              )}

              {step < totalSteps ? (
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={handleNext}
                >
                  Próximo
                  <ArrowRightIcon size={16} />
                </button>
              ) : (
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Criar Cliente
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Popup */}
      {errorPopup && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between animate-in slide-in-from-right-4 fade-in">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">{errorPopup}</span>
            </div>
            <button
              onClick={() => setErrorPopup(null)}
              className="ml-2 hover:bg-red-600 rounded p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
