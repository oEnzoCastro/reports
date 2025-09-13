"use server";

import { createSession, decrypt, deleteSession } from "@/lib/session";
import { authUser } from "@/services/db";
// import { authUser, postClient } from "@/services/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters" })
    .trim(),
});

const createClientSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  cpfcnpj: z.string().min(11).max(14).trim(),
  address: z.string().min(5).max(200).trim(),
  sex: z.string().min(1).max(200).trim(),
  dateofbirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .transform((val) => new Date(val)),
  maritalstatus: z.string().min(2).max(100).trim(),
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
  if ((await authUser(email, password)) == false) {
    return {
      errors: {
        password: ["Invalid email or password!"],
      },
    };
  }

  // User is correct -> Create Session
  await createSession(email);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
