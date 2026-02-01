"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-black">FS</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter">FeeSmart</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin & Staff Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
        </div>

        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-8 px-8 pb-0">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-none py-1 px-3">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Secure Login
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@institute.com"
                    className="h-12 pl-11 rounded-2xl bg-muted/50 border-none focus-visible:ring-accent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Link href="#" className="text-xs font-semibold text-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 pl-11 pr-11 rounded-2xl bg-muted/50 border-none focus-visible:ring-accent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-[11px] font-bold p-3 rounded-xl border border-destructive/20 text-center animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl font-bold text-base shadow-lg shadow-accent/20 group"
              >
                Sign In
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-medium">Or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border-border/50 bg-transparent hover:bg-muted font-bold"
                asChild
              >
                <Link href="/auth/student-login">Student Login (Phone + DOB)</Link>
              </Button>

              <div className="text-center text-sm pt-2">
                New institute?{" "}
                <Link href="/auth/register" className="text-accent font-bold hover:underline">
                  Register here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 FeeSmart Inc. <br />
            Powered by AI for seamless educational finance.
          </p>
        </div>
      </div>
    </div>
  )
}
