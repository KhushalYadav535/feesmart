"use server"

import { login as authLogin, logout as authLogout, type UserRole } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function login(role: UserRole) {
  await authLogin(role)
  revalidatePath("/")
}

export async function logout() {
  await authLogout()
  revalidatePath("/")
}
