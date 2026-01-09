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
import { ArrowRight, ShieldCheck, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function StudentLoginPage() {
  const [phone, setPhone] = useState("")
  const [dob, setDob] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { loginStudent } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Normalize phone number - remove extra spaces and ensure format
      const normalizedPhone = phone.trim().replace(/\s+/g, " ")
      const normalizedDOB = dob.trim()
      
      await loginStudent(normalizedPhone, normalizedDOB)
      toast({
        title: "Login Successful",
        description: "Welcome to Student Portal",
      })
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "No student found with these details. Try Demo: Phone: +91 9876543210, DOB: 2010-05-15",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-black">FS</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-balance">FeeSmart</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-pretty">Student Portal Login</h1>
          <p className="text-muted-foreground">Access your fee history and payment details</p>
        </div>

        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-8 px-8 pb-0">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-none py-1 px-3">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Student Access
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Registered Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 00000 00000"
                    className="h-12 pl-11 rounded-2xl bg-muted/50 border-none focus-visible:ring-accent"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Date of Birth
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dob"
                    type="date"
                    className="h-12 pl-11 rounded-2xl bg-muted/50 border-none focus-visible:ring-accent"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl font-bold text-base shadow-lg shadow-accent/20 group"
              >
                {isLoading ? "Authenticating..." : "View Dashboard"}
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
                <Link href="/auth/parent-login">Parent Login</Link>
              </Button>

              <div className="text-center text-sm pt-2">
                Admin or Staff?{" "}
                <Link href="/auth/login" className="text-accent font-bold hover:underline">
                  Login here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
