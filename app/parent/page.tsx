"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getParentByEmail, getStudentsByParent, getPaymentsByStudent, type Student, type Payment } from "@/lib/auth"
import { Users, DollarSign, AlertCircle, Download, TrendingUp, CreditCard, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ParentPortal() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [children, setChildren] = useState<Student[]>([])
  const [selectedChild, setSelectedChild] = useState<Student | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "parent") {
        router.push("/auth/parent-login")
        return
      }

      // Get parent by email from authenticated user
      const parent = getParentByEmail(user.email)
      if (parent) {
        const childrenList = getStudentsByParent(parent.id)
        setChildren(childrenList)
        if (childrenList.length > 0) {
          setSelectedChild(childrenList[0])
          setPayments(getPaymentsByStudent(childrenList[0].id))
        }
      }
    }
  }, [isLoading, user, router])

  const handleChildSelect = (child: Student) => {
    setSelectedChild(child)
    setPayments(getPaymentsByStudent(child.id))
  }

  const handlePayNow = () => {
    if (selectedChild) {
      setPaymentDialogOpen(true)
    }
  }

  const handleSubmitPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast({
      title: "Payment Processed",
      description: `Payment for ${selectedChild?.name} has been recorded successfully.`,
    })
    setPaymentDialogOpen(false)
  }

  const handleDownloadReceipt = (paymentId: string) => {
    toast({
      title: "Downloading Receipt",
      description: `Receipt for payment #${paymentId.slice(0, 8)} is being generated.`,
    })
  }

  if (isLoading) return null

  const totalStats = children.reduce(
    (acc, child) => ({
      totalFees: acc.totalFees + child.totalFees,
      paidFees: acc.paidFees + child.paidFees,
      pending: acc.pending + (child.totalFees - child.paidFees),
    }),
    { totalFees: 0, paidFees: 0, pending: 0 }
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <Sidebar />
      <main className="ml-64 container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parent Portal</h1>
            <p className="text-muted-foreground">View and manage fees for your children</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Children</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{children.length}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Enrolled students</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Total Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                ₹{totalStats.paidFees.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">All children combined</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Pending Amount</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                ₹{totalStats.pending.toLocaleString()}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">Requires payment</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Select Child</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedChild?.id === child.id ? "border-accent bg-accent/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleChildSelect(child)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{child.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {child.class} • Roll: {child.rollNumber}
                        </p>
                      </div>
                      <Badge
                        variant={
                          child.status === "paid" ? "default" : child.status === "overdue" ? "destructive" : "secondary"
                        }
                      >
                        {child.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedChild && (
            <Card className="lg:col-span-2 border-none shadow-sm">
              <CardHeader>
                <CardTitle>{selectedChild.name} - Fee Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold">₹{selectedChild.paidFees.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ ₹{selectedChild.totalFees.toLocaleString()}</span>
                  </div>
                  <Progress
                    value={(selectedChild.paidFees / selectedChild.totalFees) * 100}
                    className="h-3 bg-muted"
                  />
                  <div className="flex justify-between mt-3 text-xs">
                    <span className="text-muted-foreground font-medium">
                      ₹{(selectedChild.totalFees - selectedChild.paidFees).toLocaleString()} Remaining
                    </span>
                    <span className="text-accent font-bold">
                      {((selectedChild.paidFees / selectedChild.totalFees) * 100).toFixed(0)}% Completed
                    </span>
                  </div>
                </div>

                {selectedChild.status !== "paid" && (
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Payment Due</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Due date: {new Date(selectedChild.dueDate).toLocaleDateString()}
                        </p>
                        <Button onClick={handlePayNow}>Pay Now</Button>
                      </div>
                    </div>
                  </div>
                )}

                <Tabs defaultValue="history">
                  <TabsList>
                    <TabsTrigger value="history">Payment History</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="history">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Receipt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.length > 0 ? (
                          payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                              <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                              <TableCell className="capitalize">{payment.method}</TableCell>
                              <TableCell>
                                <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                                  {payment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(payment.id)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No payment history
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="documents">
                    <div className="space-y-2">
                      {payments.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Fee Receipt - {new Date(p.date).toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">₹{p.amount.toLocaleString()} • Completed</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(p.id)}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Pay fees for {selectedChild?.name} ({selectedChild?.class})
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="space-y-2">
              <Label>Amount to Pay</Label>
              <Input
                type="number"
                defaultValue={selectedChild ? selectedChild.totalFees - selectedChild.paidFees : 0}
                max={selectedChild ? selectedChild.totalFees - selectedChild.paidFees : 0}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <select className="w-full p-2 border rounded-lg" required>
                <option value="">Select method</option>
                <option value="upi">UPI</option>
                <option value="card">Credit/Debit Card</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Proceed to Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

