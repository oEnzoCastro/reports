"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { useFormStatus } from "react-dom";

export default function page() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-(--background) to-white flex">
      {/* Left Side - Branding/Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-(--primary) relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-(--primary) to-(--secondary)"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold mb-6">Junte-se a nós</h2>
            <p className="text-xl text-white/90 mb-8">
              Comece a organizar seus relatórios e gerenciar seus clientes hoje
              mesmo
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80">Configuração rápida</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80">Interface moderna</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80">Suporte dedicado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-(--primary) mb-4">
              Criar nova conta
            </h1>
            <p className="text-(--secondary) text-lg">
              Preencha os dados abaixo para começar
            </p>
          </div>

          {/* Form */}
          <form action={loginAction} className="space-y-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-base font-semibold text-(--primary) mb-3"
                >
                  Nome completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:ring-3 focus:ring-(--primary)/20 focus:border-(--primary) transition-all duration-200 text-(--primary) placeholder-gray-400"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-semibold text-(--primary) mb-3"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:ring-3 focus:ring-(--primary)/20 focus:border-(--primary) transition-all duration-200 text-(--primary) placeholder-gray-400"
                />
                {state?.errors?.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {state.errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-semibold text-(--primary) mb-3"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:ring-3 focus:ring-(--primary)/20 focus:border-(--primary) transition-all duration-200 text-(--primary) placeholder-gray-400"
                />
                {state?.errors?.password && (
                  <p className="text-red-500 text-sm mt-2">
                    {state.errors.password}
                  </p>
                )}
                <p className="text-sm text-(--secondary) mt-2">
                  Mínimo de 3 caracteres
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <SubmitButton />

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-(--secondary)">ou</span>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <p className="text-base text-(--secondary)">
                Já possui uma conta?{" "}
                <a
                  href="/login"
                  className="font-semibold text-(--primary) hover:text-(--secondary) transition-colors duration-200"
                >
                  Fazer login
                </a>
              </p>
            </div>
          </form>

          {/* Terms */}
          <p className="text-sm text-center text-(--secondary) mt-8">
            Ao criar uma conta, você concorda com nossos{" "}
            <a
              href="#"
              className="text-(--primary) hover:underline font-medium"
            >
              Termos de Uso
            </a>{" "}
            e{" "}
            <a
              href="#"
              className="text-(--primary) hover:underline font-medium"
            >
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-(--primary) text-white py-4 px-6 text-lg rounded-xl font-semibold hover:bg-(--secondary) focus:ring-4 focus:ring-(--primary)/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Criando conta...
        </>
      ) : (
        "Criar conta"
      )}
    </button>
  );
}
