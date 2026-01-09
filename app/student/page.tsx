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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getStudentByUserId,
  getPaymentsByStudent,
  getDocumentsByStudent,
  getStudentsByTenant,
  type Student,
  type Payment,
  type Document,
} from "@/lib/auth"
import { CreditCard, AlertCircle, Download, TrendingUp, Sparkles, ArrowRight, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const handleLogout = () => {
  localStorage.removeItem("feesmart_user")
  window.location.href = "/"
}

export default function StudentDashboard() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [extensionDialogOpen, setExtensionDialogOpen] = useState(false)
  const [scholarshipDialogOpen, setScholarshipDialogOpen] = useState(false)
  const { toast } = useToast()

  const [paymentPlans, setPaymentPlans] = useState([
    { id: 1, name: "3-Month Plan", installments: 3, monthlyAmount: 6167, discount: 5 },
    { id: 2, name: "6-Month Plan", installments: 6, monthlyAmount: 3083, discount: 10 },
  ])
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

  const handleDownloadReceipt = (paymentId: string) => {
    toast({
      title: "Downloading Receipt",
      description: `Receipt for payment #${paymentId.slice(0, 8)} is being generated.`,
    })
    // Mock PDF download
    console.log("[v0] Generating PDF for payment:", paymentId)
  }

  const handlePayNow = () => {
    setPaymentDialogOpen(true)
  }

  const handleSubmitPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast({
      title: "Payment Processed",
      description: "Your fee payment has been recorded successfully. Receipt will be sent via email.",
    })
    setPaymentDialogOpen(false)
  }

  const handleRequestExtension = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast({
      title: "Extension Request Submitted",
      description: "Your request has been sent to the admin for approval.",
    })
    setExtensionDialogOpen(false)
  }

  const handleApplyScholarship = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast({
      title: "Scholarship Application Submitted",
      description: "Your application is under review. You will be notified soon.",
    })
    setScholarshipDialogOpen(false)
  }

  const handleExportHistory = () => {
    toast({
      title: "Export Started",
      description: "Payment history is being exported to CSV format.",
    })
  }

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "student")) {
      router.push("/auth/student-login")
      return
    }

    if (user && user.role === "student") {
      // Find student by email since user.id format is "u-std-s1" but we need "s1"
      const students = getStudentsByTenant(user.tenantId || "")
      const studentByEmail = students.find((s) => s.email === user.email)
      if (studentByEmail) {
        setStudent(studentByEmail)
        setPayments(getPaymentsByStudent(studentByEmail.id))
        setDocuments(getDocumentsByStudent(studentByEmail.id))
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || !student) return null

  const paidPercentage = (student.paidFees / student.totalFees) * 100
  const remainingAmount = student.totalFees - student.paidFees

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <Sidebar />
      <main className="ml-64 container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-pretty">Welcome, {student.name.split(" ")[0]}</h1>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-none h-5">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Verified
              </Badge>
            </div>
            {/* Added Batch and Roll Number info to the header */}
            <p className="text-muted-foreground text-sm font-medium">
              Roll: {student.rollNumber} • Batch: {student.batch} • {student.class}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-card shadow-sm border-none" onClick={handleLogout}>
              Logout
            </Button>
            <Button size="sm" className="shadow-lg shadow-accent/20" onClick={handlePayNow}>
              Pay Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 border-none shadow-sm overflow-hidden group bg-gradient-to-br from-accent/5 to-accent/10">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Payment Progress
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold">₹{student.paidFees.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/ ₹{student.totalFees.toLocaleString()}</span>
              </div>
              <Progress value={paidPercentage} className="h-3 bg-muted group-hover:bg-muted/50 transition-colors" />
              <div className="flex justify-between mt-3 text-xs">
                <span className="text-muted-foreground font-medium">₹{remainingAmount.toLocaleString()} Remaining</span>
                <span className="text-accent font-bold">{paidPercentage.toFixed(0)}% Completed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Next Milestone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                <div className="text-sm font-semibold mb-1">Term 2 Examination Fee</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Due by {new Date(student.dueDate).toLocaleDateString()}
                </div>
                <Badge variant="outline" className="text-[10px] h-4 border-accent/20 text-accent uppercase font-bold">
                  Upcoming
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-accent hover:text-accent hover:bg-accent/5 group"
              >
                View Details
                <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {student.status !== "paid" && (
          <Card className="mb-8 border-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Payment Due</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You have ₹{remainingAmount.toLocaleString()} pending. Due date:{" "}
                    {new Date(student.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={handlePayNow}>Pay Now</Button>
                    <Button variant="outline" onClick={() => setExtensionDialogOpen(true)}>
                      Request Extension
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="requests">Requests & Extension</TabsTrigger>
            <TabsTrigger value="downloads">Documents</TabsTrigger>
            {/* Add Fee Discount & Concessions tab */}
            <TabsTrigger value="discounts">Fee Discounts</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payment History</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExportHistory}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
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
                      {payments.map((payment) => (
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
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>No payment history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Suggested Payment Plans</CardTitle>
                <p className="text-xs text-muted-foreground">
                  AI-recommended installment options based on your profile
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-accent"
                      onClick={() => {
                        setSelectedPlan(plan.id)
                        toast({
                          title: "Plan Selected",
                          description: `${plan.name} selected. Monthly payment: ₹${plan.monthlyAmount.toLocaleString()}`,
                        })
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-xs text-muted-foreground">{plan.installments} equal installments</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 border-none">-{plan.discount}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold">₹{plan.monthlyAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">per month</p>
                        <Button className="w-full" size="sm" variant={selectedPlan === plan.id ? "default" : "outline"}>
                          {selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col gap-2 bg-transparent"
                    onClick={() => setExtensionDialogOpen(true)}
                  >
                    <CreditCard className="h-6 w-6" />
                    Request Payment Extension
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col gap-2 bg-transparent"
                    onClick={() => setScholarshipDialogOpen(true)}
                  >
                    <Download className="h-6 w-6" />
                    Apply for Scholarship
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Receipts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Fee Receipts</h3>
                  <div className="space-y-2">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Fee Receipt - {new Date(p.date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">₹{p.amount.toLocaleString()} • Completed</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(p.id)}>
                          Download PDF
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Other Documents</h3>
                  <div className="space-y-2">
                    {documents.length > 0 ? (
                      documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.type.replace("_", " ")} • {new Date(doc.uploadedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(doc.fileUrl, "_blank")}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No documents available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Fee Discount & Concessions tab */}
          <TabsContent value="discounts">
            <Card>
              <CardHeader>
                <CardTitle>Fee Discounts & Concessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Early Payment Discount", amount: 2500, status: "applicable", validity: "Until 15th Jan" },
                    { name: "Sibling Discount", amount: 1500, status: "claimed", validity: "Current Year" },
                    { name: "Sports Scholarship (Applied)", amount: 5000, status: "pending", validity: "Under Review" },
                  ].map((discount, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{discount.name}</p>
                        <p className="text-sm text-muted-foreground">{discount.validity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">₹{discount.amount.toLocaleString()}</p>
                        <Badge variant={discount.status === "claimed" ? "default" : "secondary"}>
                          {discount.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>Complete your fee payment securely via multiple payment gateways</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="space-y-2">
              <Label>Amount to Pay</Label>
              <Input type="number" placeholder="Enter amount" max={remainingAmount} defaultValue={remainingAmount} required />
              <p className="text-xs text-muted-foreground">Maximum: ₹{remainingAmount.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <Label>Payment Gateway</Label>
              <select className="w-full p-2 border rounded-lg bg-background" required>
                <option value="">Select payment gateway</option>
                <option value="razorpay">Razorpay (UPI, Cards, Net Banking)</option>
                <option value="payu">PayU (Cards, UPI, Wallets)</option>
                <option value="cashfree">Cashfree (UPI, Cards)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="p-3 border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors text-sm font-medium"
                >
                  <div className="text-xs mb-1">💳</div>
                  UPI
                </button>
                <button
                  type="button"
                  className="p-3 border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors text-sm font-medium"
                >
                  <div className="text-xs mb-1">💳</div>
                  Card
                </button>
                <button
                  type="button"
                  className="p-3 border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors text-sm font-medium"
                >
                  <div className="text-xs mb-1">🏦</div>
                  NetBanking
                </button>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Amount</span>
                <span className="font-medium">₹{remainingAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">₹0</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total Payable</span>
                <span className="text-accent">₹{remainingAmount.toLocaleString()}</span>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Proceed to Secure Payment
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              🔒 Your payment is secured with 256-bit SSL encryption
            </p>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={extensionDialogOpen} onOpenChange={setExtensionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payment Extension</DialogTitle>
            <DialogDescription>Submit a request to extend your payment deadline</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestExtension} className="space-y-4">
            <div className="space-y-2">
              <Label>Reason for Extension</Label>
              <textarea
                className="w-full p-2 border rounded-lg min-h-[100px]"
                placeholder="Explain your situation..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Requested New Date</Label>
              <Input type="date" required />
            </div>
            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={scholarshipDialogOpen} onOpenChange={setScholarshipDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Scholarship</DialogTitle>
            <DialogDescription>Submit your scholarship application</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApplyScholarship} className="space-y-4">
            <div className="space-y-2">
              <Label>Scholarship Type</Label>
              <select className="w-full p-2 border rounded-lg" required>
                <option value="">Select type</option>
                <option value="merit">Merit-Based</option>
                <option value="financial">Financial Aid</option>
                <option value="sports">Sports Scholarship</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <Input type="file" />
            </div>
            <div className="space-y-2">
              <Label>Additional Information</Label>
              <textarea className="w-full p-2 border rounded-lg min-h-[80px]" placeholder="Any additional details..." />
            </div>
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
