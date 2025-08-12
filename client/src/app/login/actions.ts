"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const testUser = {
  id: "gduiagd7u2",
  email: "enzocastru@gmail.com",
  password: "123456789",
};

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
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
  const { email, password } = result.data;

  

  // compare the info to the BD
  if (email !== testUser.email || password !== testUser.password) {
    return {
      errors: {
        password: ["Invalid email or password!"],
      },
    };
  }

  // User is correct -> Create Session

  await createSession(testUser.id);

  redirect("/");
}

export async function logout() {

    await deleteSession()
    redirect("/login")
}
