"use server";

import { createSession, deleteSession } from "@/lib/session";
import { getUser, postUser } from "@/services/db";
// import { checkEmail, createUser } from "@/services/db";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  // Check form validation

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Passed validation

  // Get info from form
  const { email, name, password } = result.data;

  // compare the info to the BD
  if ((await getUser(email)) !== false) {
    return {
      errors: {
        email: ["Usuário já existe!"],
      },
    };
  }

  // User does not exist -> Create User -> Create Session

  await postUser(name, email, password);

  await createSession(email);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
