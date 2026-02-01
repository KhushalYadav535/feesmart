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
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("feesmart_user")
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          // Support both old and new format
          const userData = parsed.user || parsed
          const token = parsed.token
          
          // Only restore if we have both user and token
          if (userData && token) {
            setUser(userData)
          } else {
            // If token is missing, clear invalid data
            localStorage.removeItem("feesmart_user")
          }
        }
      } catch (e) {
        console.error("[v0] Failed to parse stored user:", e)
        localStorage.removeItem("feesmart_user")
      } finally {
        setLoading(false)
      }
    }
    
    initializeAuth()
  }, [])

  // Handle route protection
  useEffect(() => {
    // Don't redirect while loading - wait for auth state to be restored
    if (loading) return

    // Allow public routes
    if (pathname === "/" || pathname.startsWith("/auth")) {
      return
    }

    // Only redirect to login if we're sure there's no user (after loading is complete)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Invalid credentials");
      }
      
      const data = await response.json()
      const authenticatedUser = data.user
      const token = data.token
      
      if (authenticatedUser && token) {
        setUser(authenticatedUser)
        localStorage.setItem("feesmart_user", JSON.stringify({ user: authenticatedUser, token }))

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role, tenantName })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }
      
      const data = await response.json()
      const newUser = data.user
      const token = data.token
      
      if (newUser && token) {
        setUser(newUser)
        localStorage.setItem("feesmart_user", JSON.stringify({ user: newUser, token }))
        router.push(role === "admin" ? "/admin" : "/")
      }
    } catch (error: any) {
      console.error("[v0] Registration failed:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginStudent = async (phone: string, dob: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/student-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, dateOfBirth: dob })
      })
      
      if (!response.ok) {
        throw new Error("Invalid credentials")
      }
      
      const data = await response.json()
      const authenticatedUser = data.user
      const token = data.token
      
      if (authenticatedUser && token) {
        setUser(authenticatedUser)
        localStorage.setItem("feesmart_user", JSON.stringify({ user: authenticatedUser, token }))
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/parent-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      if (!response.ok) {
        throw new Error("Invalid credentials")
      }
      
      const data = await response.json()
      const authenticatedUser = data.user
      const token = data.token
      
      if (authenticatedUser && token) {
        setUser(authenticatedUser)
        localStorage.setItem("feesmart_user", JSON.stringify({ user: authenticatedUser, token }))
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
