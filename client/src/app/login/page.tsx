"use client";

import { useActionState } from "react";
import { login } from "../../lib/actions";
import { useFormStatus } from "react-dom";

export default function page() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="flex items-center w-full justify-center text-(--petrolBlue)">
      <form
        action={loginAction}
        className="flex flex-col gap-5 bg-(--petrolBlue) text-white p-10 text-[5dvh] rounded-md"
      >
        <div className="flex flex-col *:rounded-md *:px-3 gap-5 *:bg-white justify-center items-start text-(--petrolBlue)">
          <input id="email" name="email" type="email" placeholder="Email" />
          {state?.errors?.email && (
            <p className="text-red-500">{state.errors.email}</p>
          )}
          <input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
          />
          {state?.errors?.password && (
            <p className="text-red-500">{state.errors.password}</p>
          )}
        </div>
        <div className="flex justify-around">
          <SubmitButton />
          <a href="/signin" className="hover:underline px-4">
            Criar conta
          </a>
        </div>
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer px-4 py-1 rounded-md bg-black/20"
    >
      Login
    </button>
  );
}
