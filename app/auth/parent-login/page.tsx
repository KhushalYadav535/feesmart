"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, ShieldCheck, Phone } from "lucide-react"
import Link from "next/link"

export default function ParentLogin() {
  const { loginParent } = useAuth()
  const { toast } = useToast()
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Normalize phone number - remove extra spaces
      const normalizedPhone = phone.trim().replace(/\s+/g, " ")
      
      await loginParent(normalizedPhone)
      toast({
        title: "Login Successful",
        description: "Welcome to Parent Portal",
      })
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid phone number. Demo: +91 9876543210 or +91 9876543211",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Parent Portal Login</h1>
          <p className="text-muted-foreground">Access your child's fee information and payment history</p>
        </div>

        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-8 px-8 pb-0">
            <div className="flex justify-center mb-4">
              <div className="bg-accent/10 text-accent border-none py-1 px-3 rounded-full text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Access
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
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
                <p className="text-xs text-muted-foreground ml-1">
                  Demo: Use +91 9876543210 or +91 9876543211
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl font-bold text-base shadow-lg shadow-accent/20 group"
              >
                {loading ? "Authenticating..." : "View Dashboard"}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="text-center text-sm pt-2">
                Student or Admin?{" "}
                <Link href="/auth/login" className="text-accent font-bold hover:underline">
                  Login here
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

