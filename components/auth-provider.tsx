"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type User, type UserRole, loginUser, registerUser, canAccessRoute, loginStudentByPhoneDOB, loginParentByPhone } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginStudent: (phone: string, dob: string) => Promise<void>
  loginParent: (phone: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole, tenantName?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("feesmart_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("[v0] Failed to parse stored user:", e)
        localStorage.removeItem("feesmart_user")
      }
    }
    setLoading(false)
  }, [])

  // Handle route protection
  useEffect(() => {
    if (loading) return

    // Allow public routes
    if (pathname === "/" || pathname.startsWith("/auth")) {
      return
    }

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Check role-based access
    if (!canAccessRoute(user.role, pathname)) {
      // Redirect to appropriate dashboard if accessing unauthorized route
      if (user.role === "super_admin") router.push("/super-admin")
      else if (user.role === "admin") router.push("/admin")
      else if (user.role === "staff") router.push("/staff")
      else if (user.role === "student") router.push("/student")
      else if (user.role === "parent") router.push("/parent")
      else router.push("/")
    }
  }, [user, loading, pathname, router])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const authenticatedUser = await loginUser(email, password)
      if (authenticatedUser) {
        setUser(authenticatedUser)
        localStorage.setItem("feesmart_user", JSON.stringify(authenticatedUser))

        // Redirect based on role
        if (authenticatedUser.role === "super_admin") router.push("/super-admin")
        else if (authenticatedUser.role === "admin") router.push("/admin")
        else if (authenticatedUser.role === "staff") router.push("/staff")
        else if (authenticatedUser.role === "student") router.push("/student")
        else if (authenticatedUser.role === "parent") router.push("/parent")
        else router.push("/")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error: any) {
      console.error("[v0] Login failed:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole, tenantName?: string) => {
    setLoading(true)
    try {
      const newUser = await registerUser(email, password, name, role, tenantName)
      if (newUser) {
        setUser(newUser)
        localStorage.setItem("feesmart_user", JSON.stringify(newUser))
        router.push(role === "admin" ? "/admin" : "/")
      }
    } finally {
      setLoading(false)
    }
  }

  const loginStudent = async (phone: string, dob: string) => {
    setLoading(true)
    try {
      const authenticatedUser = await loginStudentByPhoneDOB(phone, dob)
      if (authenticatedUser) {
        setUser(authenticatedUser)
        localStorage.setItem("feesmart_user", JSON.stringify(authenticatedUser))
        router.push("/student")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error: any) {
      console.error("[v0] Student login failed:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginParent = async (phone: string) => {
    setLoading(true)
    try {
      const authenticatedUser = await loginParentByPhone(phone)
      if (authenticatedUser) {
        setUser(authenticatedUser)
        localStorage.setItem("feesmart_user", JSON.stringify(authenticatedUser))
        router.push("/parent")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error: any) {
      console.error("[v0] Parent login failed:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("feesmart_user")
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, loginStudent, loginParent, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
