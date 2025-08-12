"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { useFormStatus } from "react-dom";

export default function page() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="flex justify-center">
      <form
        action={loginAction}
        className="flex flex-col mt-10 p-10 gap-5 rounded-md *:rounded-md *:px-3 *:bg-white justify-center items-start bg-(--petrolBlue) text-[5dvh]"
      >
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
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="cursor-pointer">
      Sign up
    </button>
  );
}
