"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTenants } from "@/lib/auth"
import { Building2, Users, CreditCard, Activity, Download, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/lib/auth"

const tenantData = [
  { name: "Demo School", revenue: 45000 },
  { name: "Greenwood", revenue: 32000 },
  { name: "Global Path", revenue: 28000 },
  { name: "Nexus Inst", revenue: 15000 },
]

export default function SuperAdminDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [tenants, setTenants] = useState(getTenants())
  const [regLoading, setRegLoading] = useState(false)
  const [regOpen, setRegOpen] = useState(false)
  const [editTenantOpen, setEditTenantOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "super_admin")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const handleBillingAction = (tenantName: string) => {
    toast({
      title: "Action Processed",
      description: `Billing update for ${tenantName} has been recorded.`,
    })
  }

  const handleSystemAction = (action: string) => {
    toast({
      title: "System Notification",
      description: `${action} has been triggered successfully.`,
    })
  }

  const handleToggleTenantStatus = (id: string, name: string, currentStatus: boolean) => {
    setTenants(tenants.map((t) => (t.id === id ? { ...t, isActive: !currentStatus } : t)))
    toast({
      title: currentStatus ? "Institute Suspended" : "Institute Activated",
      description: `${name} status has been updated.`,
      variant: currentStatus ? "destructive" : "default",
    })
  }

  const handleAddInstitute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRegLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const instituteName = formData.get("institute") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await registerUser(email, password, name, "admin", instituteName)
      setTenants(getTenants())
      setRegOpen(false)
      toast({ title: "Institute Registered", description: `${instituteName} has been added to the system.` })
    } catch (err: any) {
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" })
    } finally {
      setRegLoading(false)
    }
  }

  const handleEditTenant = (tenant: any) => {
    setSelectedTenant(tenant)
    setEditTenantOpen(true)
  }

  const handleSuspendTenant = (tenantName: string) => {
    toast({
      title: "Tenant Suspended",
      description: `${tenantName} has been suspended. All access has been revoked.`,
      variant: "destructive",
    })
  }

  const handleViewAllLogs = () => {
    toast({
      title: "System Logs",
      description: "Opening comprehensive activity log viewer...",
    })
  }

  const handleDownloadInvoice = (tenantName: string) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for ${tenantName} has been generated and downloaded.`,
    })
  }

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <Sidebar />
      <main className="ml-64 container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
            <p className="text-muted-foreground">Manage multi-tenant institutes and global platform health.</p>
          </div>
          <Dialog open={regOpen} onOpenChange={setRegOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20">Add New Institute</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Institute</DialogTitle>
                <DialogDescription>Create a primary admin account for a new tenant.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddInstitute} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institute">Institute Name</Label>
                  <Input id="institute" name="institute" placeholder="e.g. Global Path Academy" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Admin Name</Label>
                  <Input id="name" name="name" placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input id="email" name="email" type="email" placeholder="admin@academy.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={regLoading}>
                  {regLoading ? "Registering..." : "Create Institutional Account"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Active Tenants</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {tenants.filter((t) => t.isActive).length}
              </div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 new this week
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">System Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">4,128</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Across all institutes</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Monthly Recurring Revenue
              </CardTitle>
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">₹12.4L</div>
              <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.5% growth
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Platform Health
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">99.9%</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Uptime past 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Top Revenue Institutes</CardTitle>
              <p className="text-xs text-muted-foreground">Monthly billing distribution</p>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tenantData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {tenantData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "var(--accent)" : "var(--primary)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Global Activity</CardTitle>
              <p className="text-xs text-muted-foreground">Real-time system logs</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { tenant: "Demo School", action: "Processed 12 fee payments", time: "5m ago" },
                  { tenant: "Nexus Inst", action: "New student registration", time: "12m ago" },
                  { tenant: "Greenwood", action: "Generated monthly report", time: "45m ago" },
                  { tenant: "Global Path", action: "Updated fee structure", time: "1h ago" },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm border-b border-border/50 pb-3 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div>
                      <div className="font-medium">Tenant "{log.tenant}"</div>
                      <p className="text-xs text-muted-foreground">
                        {log.action} • {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs text-accent" onClick={handleViewAllLogs}>
                View All Logs
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tenants" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="tenants" className="rounded-lg px-6">
              Institutes
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg px-6">
              Platform Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenants">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Institute Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Institute Name</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant.id} className="group transition-colors">
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {tenant.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(tenant.nextBillingDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={tenant.isActive ? "default" : "secondary"}
                            className={tenant.isActive ? "bg-accent/10 text-accent hover:bg-accent/20 border-none" : ""}
                          >
                            {tenant.isActive ? "Active" : "Suspended"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary/5 transition-colors"
                            onClick={() => handleEditTenant(tenant)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${tenant.isActive ? "text-destructive hover:bg-destructive/5" : "text-emerald-500 hover:bg-emerald-50/5"} transition-colors`}
                            onClick={() => handleToggleTenantStatus(tenant.id, tenant.name, tenant.isActive)}
                          >
                            {tenant.isActive ? "Suspend" : "Activate"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Platform Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((t) => (
                      <TableRow key={t.id} className="group transition-colors">
                        <TableCell>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell>₹{t.plan === "basic" ? "499" : t.plan === "standard" ? "999" : "1,999"}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-accent/10 text-accent border-none">
                            Paid
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(t.name)}
                            className="hover:bg-accent/5"
                          >
                            <Download className="h-4 w-4 text-accent" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
