"use client";

import React, { useActionState } from "react";
import "@/app/clients/style.css"; // Assuming you have a CSS file for styles
import { createClient } from "@/lib/actions";

export default function Clients({ userClients }: any) {
  const [isAddClientOpen, setIsAddClientOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState(null);

  const [state, createClientAction] = useActionState(createClient, undefined);


  return (
    <div className="w-full h-full">
      <div className="flex gap-4 bg-(--petrolBlue)/70 px-5 py-3">
        <div className="flex relative w-full justify-self-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="absolute top-1/2 left-2 translate-y-[-50%] fill-white/40 p-1 h-2/3"
          >
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-white/20 focus:bg-white/15 border-1 border-white/30 text-white py-1 px-3 pl-10 rounded-md w-full focus:ring-2 outline-none transition duration-300"
          />
        </div>
        <button
          onClick={() => setIsAddClientOpen(!isAddClientOpen)}
          className="bg-(--petrolBlue) text-nowrap text-white rounded-md p-2 cursor-pointer"
        >
          Adicionar Cliente
        </button>
      </div>
      <div
        className={`bg-(--petrolBlue)/5 overflow-hidden  ${
          isAddClientOpen ? "h-full" : "h-0"
        } `}
      >
        <form action={createClientAction} className="p-10 w-1/3 ">
          <h1 className="font-medium text-xl">Adicionar Cliente </h1>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <label htmlFor="name" className="flex flex-col w-full">
                Nome
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nome"
                  className="border border-gray-300 rounded-md p-2 bg-white"
                />
                {state?.errors?.name && (
                  <p className="text-red-500">{state.errors.name}</p>
                )}
              </label>
              <label htmlFor="cpfcnpj" className="flex flex-col w-full">
                CPF/CNPJ
                <input
                  type="text"
                  id="cpfcnpj"
                  name="cpfcnpj"
                  placeholder="CPF/CNPJ"
                  className="border border-gray-300 rounded-md p-2 bg-white"
                />
                {state?.errors?.cpfcnpj && (
                  <p className="text-red-500">{state.errors.cpfcnpj}</p>
                )}
              </label>
            </div>
            <label htmlFor="sex" className="flex flex-col">
              Sexo
              <input
                type="text"
                id="sex"
                name="sex"
                placeholder="Sexo"
                className="border border-gray-300 rounded-md p-2 bg-white"
              />
              {state?.errors?.address && (
                <p className="text-red-500">{state.errors.address}</p>
              )}
            </label>
            <label htmlFor="address" className="flex flex-col">
              Endereço
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Endereço"
                className="border border-gray-300 rounded-md p-2 bg-white"
              />
              {state?.errors?.address && (
                <p className="text-red-500">{state.errors.address}</p>
              )}
            </label>
            <label htmlFor="dateofbirth" className="flex flex-col">
              Data de Nascimento
              <input
                type="date"
                id="dateofbirth"
                name="dateofbirth"
                className="border border-gray-300 rounded-md p-2 bg-white"
              />
              {state?.errors?.dateofbirth && (
                <p className="text-red-500">{state.errors.dateofbirth}</p>
              )}
            </label>
            <label htmlFor="maritalstatus" className="flex flex-col">
              Estado Civil
              <input
                type="text"
                id="maritalstatus"
                name="maritalstatus"
                placeholder="Estado Civil"
                className="border border-gray-300 rounded-md p-2 bg-white"
              />
              {state?.errors?.maritalstatus && (
                <p className="text-red-500">{state.errors.maritalstatus}</p>
              )}
            </label>
            <div className="flex gap-10 font-semibold">
              <button className="bg-(--petrolBlue) text-white rounded-md p-2 cursor-pointer w-full">
                Adicionar
              </button>
              <button className="bg-(--petrolBlue)/10 text-(--petrolBlue) rounded-md p-2 cursor-pointer w-full">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex p-4">
        {userClients.length > 0 ? (
          userClients.map((userClient: any, index: number) => (
            <ClientCard key={`userClient${index}`} userClient={userClient} setSelectedClient={setSelectedClient} />
          ))
        ) : (
          <p>No clients found</p>
        )}
      </div>

      {/* Selected Client */}
      <div>

        {selectedClient && <ClientSection userClient={selectedClient} />}

      </div>
    </div>
  );
}

function ClientCard({ userClient, setSelectedClient }: any) {
  return (
    <button onClick={() => setSelectedClient(userClient)} className="ring ring-(--petrolBlue)/10 rounded-md p-5 shadow py-4">
      <div>
        <h1 className="text-lg font-semibold">{userClient.name}</h1>
      </div>
    </button>
  );
}

function ClientSection({ userClient }: any) {
  return (
    <div className="ring ring-(--petrolBlue)/10 p-5 py-4">
      <div>
        <h1 className="text-lg font-semibold">{userClient.name}</h1>

        

      </div>
    </div>
  );
}
