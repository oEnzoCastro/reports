"use client";

import React, { useActionState, useEffect, useState } from "react";
import "@/app/clients/style.css"; // Assuming you have a CSS file for styles
import { createClient } from "@/lib/actions";
import { fetchArticle } from "@/services/db";
import TextEditor from "./TextEditor";

export default function Clients({ userClients }: any) {
  const [isAddClientOpen, setIsAddClientOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState(null);
  const [state, createClientAction] = useActionState(createClient, undefined);

  const [Dependents, setDependents] = React.useState<number[]>([]);

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
        <form action={createClientAction} className="p-10">
          <h1 className="font-medium text-xl">Adicionar Cliente </h1>
          <div className="flex gap-4">
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
                <button
                  type="button"
                  onClick={() => setIsAddClientOpen(!isAddClientOpen)}
                  className="bg-(--petrolBlue)/10 text-(--petrolBlue) rounded-md p-2 cursor-pointer w-full"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <h1>Dependentes:</h1>
              <button
                type="button"
                onClick={() => {
                  setDependents((prev) => {
                    if (prev.length === 0) {
                      return [0];
                    }
                    return [...prev, prev[prev.length - 1] + 1];
                  });
                }}
                className="flex justify-center items-center gap-4 bg-(--petrolBlue)/10 hover:bg-(--petrolBlue)/20 rounded-md p-2 cursor-pointer"
              >
                Adicionar Dependente
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  className="h-5 fill-(--petrolBlue)"
                >
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
              </button>
              {/* Dependentes */}
              <div className="flex flex-col gap-4 mt-4">
                {Dependents.map((Dependent, index) => {
                  return (
                    <div key={`Dependent${index}`} className="flex">
                      <input
                        type="text"
                        className="bg-white border border-(--petrolBlue)/20 rounded-s-md p-2"
                        placeholder={`Dependente ${Dependent + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setDependents((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                        className="bg-red-200 h-full cursor-pointer px-2 rounded-e-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                          className="h-5 fill-red-400"
                        >
                          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex shadow mb-4 gap-4 p-4">
        {userClients.length > 0 ? (
          userClients.map((userClient: any, index: number) => (
            <ClientCard
              key={`userClient${index}`}
              userClient={userClient}
              setSelectedClient={setSelectedClient}
            />
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
    <button
      onClick={() => setSelectedClient(userClient)}
      className="ring ring-(--petrolBlue)/10 rounded-md p-5 shadow py-4 cursor-pointer hover:bg-(--petrolBlue)/10 transition"
    >
      <div>
        <h1 className="text-lg font-semibold">{userClient.name}</h1>
      </div>
    </button>
  );
}

function ClientSection({ userClient }: any) {
  const [articles, setArticles] = useState<any[]>([]);
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await fetchArticle(userClient.cpfcnpj);
      setArticles(data);
    };
    
    setArticle(null);
    
    fetchArticles();
  }, [userClient.cpfcnpj]);

  return (
    <div className="flex flex-col gap-4 px-10">
      <div className="flex flex-col gap-2 ring ring-(--petrolBlue)/10 p-5">
        <h1 className="font-semibold px-4 py-1 rounded-md bg-(--petrolBlue)/20">
          Perfil do Cliente
        </h1>
        <div className="flex gap-4">
          <div className="p-1 bg-(--petrolBlue) rounded-md">
            <img
              src="https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg"
              className="w-50 rounded-md "
            />
          </div>
          <div>
            <div>
              <h1 className="border-b border-(--petrolBlue)/20 font-semibold">
                Nome:
              </h1>
              <h1>{userClient.name}</h1>
            </div>
            <div>
              <h1 className="border-b border-(--petrolBlue)/20 font-semibold">
                Sexo:
              </h1>
              <h1>{userClient.sex}</h1>
            </div>
            <div>
              <h1 className="border-b border-(--petrolBlue)/20 font-semibold">
                Data de Nascimento:
              </h1>
              <h1>
                {new Date(userClient.dateofbirth).toLocaleDateString()} (
                {new Date().getFullYear() -
                  new Date(userClient.dateofbirth).getFullYear()}{" "}
                anos)
              </h1>
            </div>
          </div>
          <div>
            <div>
              <h1 className="border-b border-(--petrolBlue)/20 font-semibold">
                CPF/CNPJ:
              </h1>
              <h1>
                {userClient.cpfcnpj.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{2})/,
                  "$1.$2.$3-$4"
                )}
              </h1>
            </div>
            <div>
              <h1 className="border-b border-(--petrolBlue)/20 font-semibold">
                Endereço:
              </h1>
              <h1>{userClient.address}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="flex flex-col gap-5 ring ring-(--petrolBlue)/10 p-5">
        <h1 className="font-semibold px-4 py-1 rounded-md bg-(--petrolBlue)/20">
          Relatórios:
        </h1>
        <div className="flex gap-4">
          {articles.map((article, index) => {
            return (
              <ReportCard
                key={`report${index}`}
                article={article}
                setArticle={setArticle}
              />
            );
          })}
        </div>
      </div>

        <div>{article && <TextEditor article={article} />}</div>

    </div>
  );
}

function ReportCard({ article, setArticle }: any) {

  

  return (
    <button
      onClick={() => setArticle(article)}
      className="flex flex-col text-start bg-(--petrolBlue)/10 p-4 rounded-md w-50 cursor-pointer"
    >
      <h1 className="font-semibold">{article.title}</h1>
      <p className="text-nowrap overflow-hidden text-ellipsis">
        {article.summary}
      </p>
    </button>
  );
}
