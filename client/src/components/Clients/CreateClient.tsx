"use client";

import { useState } from "react";
import { ArrowRightIcon, ArrowLeftIcon, PlusIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/dialog";
import { postClient } from "@/services/db";

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

export default function CreateClient() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          //   dependents:
          //     formData.dependents.length > 0 ? formData.dependents : undefined,
          useremail: "enzocastru@gmail.com",
        };

        // Here you would typically send the data to your API
        console.log(clientData);
        await postClient(clientData);

        // Reset form and close dialog
        setFormData(initialFormData);
        setStep(1);
        setErrors({});

        // You might want to show a success message or refresh the client list
      } catch (error) {
        console.error("Error creating client:", error);
        alert("Erro ao criar cliente. Tente novamente.");
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nome completo"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="email@exemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone *</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData("phoneNumber", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="(11) 99999-9999"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gênero *</label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData("gender", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="prefiro-nao-informar">Prefiro não informar</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profissão *</label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => updateFormData("profession", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.profession ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Profissão"
          />
          {errors.profession && (
            <p className="text-red-500 text-xs mt-1">{errors.profession}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Data de Nascimento *
          </label>
          <input
            type="date"
            value={formData.birthdate}
            onChange={(e) => updateFormData("birthdate", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.birthdate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.birthdate && (
            <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Estado Civil *
          </label>
          <select
            value={formData.maritalStatus}
            onChange={(e) => updateFormData("maritalStatus", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.maritalStatus ? "border-red-500" : "border-gray-300"
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
            <p className="text-red-500 text-xs mt-1">{errors.maritalStatus}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            type="text"
            value={formData.address || ""}
            onChange={(e) => updateFormData("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Rua, Avenida, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Número</label>
          <input
            type="text"
            value={formData.addressNumber || ""}
            onChange={(e) => updateFormData("addressNumber", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="123"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Complemento</label>
          <input
            type="text"
            value={formData.addressComplement || ""}
            onChange={(e) =>
              updateFormData("addressComplement", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Apto, Bloco, etc."
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="hasPartner"
          checked={formData.hasPartner}
          onChange={(e) => updateFormData("hasPartner", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="hasPartner" className="text-sm font-medium">
          Cliente possui cônjuge/parceiro
        </label>
      </div>

      {formData.hasPartner && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Parceiro *
            </label>
            <input
              type="text"
              value={formData.partnerName || ""}
              onChange={(e) => updateFormData("partnerName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.partnerName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nome completo"
            />
            {errors.partnerName && (
              <p className="text-red-500 text-xs mt-1">{errors.partnerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email do Parceiro *
            </label>
            <input
              type="email"
              value={formData.partnerEmail || ""}
              onChange={(e) => updateFormData("partnerEmail", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.partnerEmail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="email@exemplo.com"
            />
            {errors.partnerEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.partnerEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Telefone do Parceiro *
            </label>
            <input
              type="tel"
              value={formData.partnerPhoneNumber || ""}
              onChange={(e) =>
                updateFormData("partnerPhoneNumber", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md ${
                errors.partnerPhoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="(11) 99999-9999"
            />
            {errors.partnerPhoneNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.partnerPhoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Gênero do Parceiro *
            </label>
            <select
              value={formData.partnerGender || ""}
              onChange={(e) => updateFormData("partnerGender", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.partnerGender ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
              <option value="prefiro-nao-informar">Prefiro não informar</option>
            </select>
            {errors.partnerGender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.partnerGender}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Profissão do Parceiro *
            </label>
            <input
              type="text"
              value={formData.partnerProfession || ""}
              onChange={(e) =>
                updateFormData("partnerProfession", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md ${
                errors.partnerProfession ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Profissão"
            />
            {errors.partnerProfession && (
              <p className="text-red-500 text-xs mt-1">
                {errors.partnerProfession}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Data de Nascimento do Parceiro *
            </label>
            <input
              type="date"
              value={formData.partnerBirthdate || ""}
              onChange={(e) =>
                updateFormData("partnerBirthdate", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md ${
                errors.partnerBirthdate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.partnerBirthdate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.partnerBirthdate}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Dependentes</h3>
        <Button
          type="button"
          onClick={addDependent}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Adicionar Dependente
        </Button>
      </div>

      {formData.dependents.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhum dependente adicionado. Clique no botão acima para adicionar.
        </p>
      ) : (
        <div className="space-y-6">
          {formData.dependents.map((dependent, index) => (
            <div key={dependent.id} className="border rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Dependente {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => removeDependent(dependent.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={dependent.name}
                    onChange={(e) =>
                      updateDependent(dependent.id, "name", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors[`dependent_${index}_name`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Nome completo"
                  />
                  {errors[`dependent_${index}_name`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`dependent_${index}_name`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={dependent.email || ""}
                    onChange={(e) =>
                      updateDependent(dependent.id, "email", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors[`dependent_${index}_email`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="email@exemplo.com"
                  />
                  {errors[`dependent_${index}_email`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`dependent_${index}_email`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gênero *
                  </label>
                  <select
                    value={dependent.gender}
                    onChange={(e) =>
                      updateDependent(dependent.id, "gender", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors[`dependent_${index}_gender`]
                        ? "border-red-500"
                        : "border-gray-300"
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
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`dependent_${index}_gender`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={dependent.birthdate || ""}
                    onChange={(e) =>
                      updateDependent(dependent.id, "birthdate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Telefone
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tipo *
                  </label>
                  <select
                    value={dependent.type}
                    onChange={(e) =>
                      updateDependent(dependent.id, "type", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors[`dependent_${index}_type`]
                        ? "border-red-500"
                        : "border-gray-300"
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
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`dependent_${index}_type`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setStep(1);
          setFormData(initialFormData);
          setErrors({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="clients-aside__add-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 bg-white [&>button:last-child]:text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>

          {/* Form Content */}
          <div className="mt-6">{getCurrentStepContent()}</div>

          {/* Progress Indicators and Navigation */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mt-6">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "size-1.5 rounded-full",
                    index + 1 === step ? "bg-primary" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            <DialogFooter className="gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon size={16} />
                  Voltar
                </Button>
              )}

              {step < totalSteps ? (
                <Button className="group" type="button" onClick={handleNext}>
                  Próximo
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit}>
                  Criar Cliente
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
