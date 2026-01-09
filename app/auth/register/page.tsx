"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Building2, User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/lib/auth"
import { useAuth } from "@/components/auth-provider"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login: authLogin } = useAuth()
  const [loading, setLoading] = useState(false)
  // <CHANGE> Added password visibility toggle state
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const instituteName = formData.get("institute") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // <CHANGE> Register admin and create tenant
      const user = await registerUser(email, password, `${firstName} ${lastName}`, "admin", instituteName)
      
      if (user) {
        toast({
          title: "Account Created Successfully",
          description: `Welcome to FeeSmart, ${user.name}!`,
        })
        
        // <CHANGE> Auto-login after registration
        await authLogin(email, password)
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 py-12">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-black">FS</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter">FeeSmart</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Register Your Institute</h1>
          <p className="text-muted-foreground">Create an admin account for your institution</p>
        </div>

        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-0 text-center">
            <div className="flex justify-center mb-4">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none py-1 px-3"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                14-Day Free Trial
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      className="h-12 pl-11 rounded-2xl bg-muted/50 border-none"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    className="h-12 px-4 rounded-2xl bg-muted/50 border-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="institute"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Institute Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="institute"
                    name="institute"
                    placeholder="e.g. Global Path Academy"
                    className="h-12 pl-11 rounded-2xl bg-muted/50 border-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Work Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@academy.com"
                    className="h-12 pl-11 rounded-2xl bg-muted/50 border-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="h-12 pl-11 pr-11 rounded-2xl bg-muted/50 border-none"
                    required
                  />
                  {/* <CHANGE> Added password visibility toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground leading-relaxed px-1">
                By clicking "Get Started", you agree to our{" "}
                <Link href="#" className="text-accent font-bold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-accent font-bold">
                  Privacy Policy
                </Link>
                .
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl font-bold text-base shadow-lg shadow-accent/20 group"
              >
                {loading ? "Creating Account..." : "Get Started Free"}
                {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-accent font-bold hover:underline">
                  Log in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
