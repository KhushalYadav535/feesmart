"use client"

import type React from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTenantStats, type Student } from "@/lib/auth"
import {
  generateInsights,
  generateOptimalReminderSchedule,
  predictMonthlyRevenue,
  processNLQuery,
  type AIInsight,
  type ReminderSchedule,
} from "@/lib/ai-services"
import {
  Users,
  DollarSign,
  AlertCircle,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  Download,
  Receipt,
  FileText,
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addStudent } from "@/lib/auth"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import type { ReceiptData } from "@/components/receipt-preview"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Pie,
  PieChart as RePieChart,
} from "recharts"
import { Smartphone, MessageCircle } from "lucide-react"
import { Eye, EyeOff } from "lucide-react"
import {
  getStudentsByBatch,
  getBatchesByTenant,
  createStaffUser,
  getUsersByTenant,
  getExpensesByTenant,
  getRefundsByTenant,
  getDiscountRequestsByTenant,
  getPaymentPlansByTenant,
  getActivityLogsByTenant,
  updateRefundStatus,
  updateDiscountStatus,
  addExpense,
  getDocumentsByTenant,
  addDocument,
  updateStudentProfile,
  updateStudent,
  deleteStudent,
  addPayment,
  getAllBatchesByTenant,
  addBatch,
  deleteBatch,
  getDefaultersByTenant,
  type Expense,
  type Refund,
  type DiscountRequest,
  type PaymentPlan,
  type ActivityLog,
  type Document,
} from "@/lib/auth"
import { getFeeHeadsByTenant, addFeeHead, updateFeeHead, deleteFeeHead, type FeeHead } from "@/lib/fee-heads"
import { cn } from "@/lib/utils"

const chartData = [
  { name: "Jan", revenue: 4000, target: 5000 },
  { name: "Feb", revenue: 3000, target: 5000 },
  { name: "Mar", revenue: 2000, target: 5000 },
  { name: "Apr", revenue: 2780, target: 5000 },
  { name: "May", revenue: 1890, target: 5000 },
  { name: "Jun", revenue: 2390, target: 5000 },
]

const feeTypeData = [
  { name: "Paid", value: 65, color: "var(--accent)" },
  { name: "Pending", value: 25, color: "var(--primary)" },
  { name: "Overdue", value: 10, color: "var(--destructive)" },
]

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState({ totalStudents: 0, totalRevenue: 0, pendingAmount: 0, defaulters: 0 })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([])
  const [predictedRevenue, setPredictedRevenue] = useState<number>(0)
  const [reminders, setReminders] = useState<ReminderSchedule[]>([])
  const [nlQuery, setNlQuery] = useState("")
  const [nlResponse, setNlResponse] = useState("")
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null)
  const [selectedBatch, setSelectedBatch] = useState("2024-25")
  const [batches, setBatches] = useState<string[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [staffDialogOpen, setStaffDialogOpen] = useState(false)
  const [staffLoading, setStaffLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [feeHeadDialogOpen, setFeeHeadDialogOpen] = useState(false)
  const [viewStudentDialogOpen, setViewStudentDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [analyticsView, setAnalyticsView] = useState("revenue")
  const [paymentReconciliation, setPaymentReconciliation] = useState<
    Array<{ date: string; expected: number; received: number; status: string }>
  >([
    { date: "2024-01-15", expected: 50000, received: 48000, status: "pending" },
    { date: "2024-01-20", expected: 35000, received: 35000, status: "completed" },
    { date: "2024-01-25", expected: 42000, received: 0, status: "pending" },
  ])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [discountRequests, setDiscountRequests] = useState<DiscountRequest[]>([])
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [studentProfileDialogOpen, setStudentProfileDialogOpen] = useState(false)
  const [editStudentDialogOpen, setEditStudentDialogOpen] = useState(false)
  const [deleteStudentDialogOpen, setDeleteStudentDialogOpen] = useState(false)
  const [studentsListDialogOpen, setStudentsListDialogOpen] = useState(false)
  const [editFeeHeadDialogOpen, setEditFeeHeadDialogOpen] = useState(false)
  const [selectedFeeHead, setSelectedFeeHead] = useState<FeeHead | null>(null)
  const [fullscreenCard, setFullscreenCard] = useState<"student" | "batch" | "fee" | null>(null)
  const [selectedCardData, setSelectedCardData] = useState<{ type: string; data: any } | null>(null)
  const [cardDetailDialogOpen, setCardDetailDialogOpen] = useState(false)

  const mockReceipt: ReceiptData = {
    receiptNo: "FS-2025-00124",
    date: new Date().toLocaleDateString(),
    studentName: "Aditya Sharma",
    rollNo: "101",
    className: "Class 10-A",
    items: [
      { name: "Tuition Fee (Quarter 1)", amount: 15000 },
      { name: "Lab & Library Charges", amount: 2500 },
      { name: "Extra-curricular Activities", amount: 1000 },
    ],
    total: 18500,
    paymentMethod: "UPI (PhonePe)",
  }

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "admin" && user.role !== "staff"))) {
      router.push("/auth/login")
    }

    if (user?.tenantId) {
      const studentsList = getStudentsByBatch(user.tenantId, selectedBatch)
      setStudents(studentsList)
      setStats(getTenantStats(user.tenantId))
      setBatches(getBatchesByTenant(user.tenantId))
      setStaffList(getUsersByTenant(user.tenantId).filter((u) => u.role === "staff"))

      loadAIInsights(studentsList, user.tenantId)
      loadFeeHeads(user.tenantId)
      setExpenses(getExpensesByTenant(user.tenantId))
      setRefunds(getRefundsByTenant(user.tenantId))
      setDiscountRequests(getDiscountRequestsByTenant(user.tenantId))
      setPaymentPlans(getPaymentPlansByTenant(user.tenantId))
      setActivityLogs(getActivityLogsByTenant(user.tenantId))
      setDocuments(getDocumentsByTenant(user.tenantId))
    }
  }, [user, isLoading, router, selectedBatch])

  const loadAIInsights = async (studentsList: Student[], tenantId: string) => {
    setLoadingAI(true)
    const insights = await generateInsights(studentsList)
    const predicted = await predictMonthlyRevenue(tenantId, studentsList)
    const reminderSchedule = generateOptimalReminderSchedule(studentsList)

    setAIInsights(insights)
    setPredictedRevenue(predicted)
    setReminders(reminderSchedule)
    setLoadingAI(false)
  }

  const loadFeeHeads = async (tenantId: string) => {
    const feeHeadsList = getFeeHeadsByTenant(tenantId)
    setFeeHeads(feeHeadsList)
  }

  const handleNLQuery = async () => {
    if (!nlQuery.trim()) return
    setLoadingAI(true)
    const response = await processNLQuery(nlQuery, students)
    setNlResponse(response)
    setLoadingAI(false)
  }

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newStudent = addStudent({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      rollNumber: formData.get("rollNumber") as string,
      class: formData.get("class") as string,
      tenantId: user?.tenantId || "",
      totalFees: Number(formData.get("totalFees")),
      paidFees: 0,
      dueDate: formData.get("dueDate") as string,
      status: "pending",
      batch: selectedBatch,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dob") as string,
      category: "regular",
      parentContact: formData.get("phone") as string,
    })

    if (user?.tenantId) {
      const updatedStudents = getStudentsByBatch(user.tenantId, selectedBatch)
      setStudents(updatedStudents)
      setStats(getTenantStats(user.tenantId))
      setBatches(getBatchesByTenant(user.tenantId))
      loadAIInsights(updatedStudents, user.tenantId)
      toast({ title: "Student Added", description: `${newStudent.name} has been added successfully.` })
    }
    setDialogOpen(false)
  }

  const handleEditStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedStudent) return
    const formData = new FormData(e.currentTarget)

    const updated = updateStudent(selectedStudent.id, {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      rollNumber: formData.get("rollNumber") as string,
      class: formData.get("class") as string,
      totalFees: Number(formData.get("totalFees")),
      dueDate: formData.get("dueDate") as string,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dob") as string,
      parentContact: formData.get("phone") as string,
    })

    if (updated && user?.tenantId) {
      const updatedStudents = getStudentsByBatch(user.tenantId, selectedBatch)
      setStudents(updatedStudents)
      setStats(getTenantStats(user.tenantId))
      loadAIInsights(updatedStudents, user.tenantId)
      toast({ title: "Student Updated", description: `${updated.name} has been updated successfully.` })
      setEditStudentDialogOpen(false)
    }
  }

  const handleDeleteStudent = () => {
    if (!selectedStudent) return
    const studentName = selectedStudent.name
    if (deleteStudent(selectedStudent.id) && user?.tenantId) {
      const updatedStudents = getStudentsByBatch(user.tenantId, selectedBatch)
      setStudents(updatedStudents)
      setStats(getTenantStats(user.tenantId))
      loadAIInsights(updatedStudents, user.tenantId)
      toast({ title: "Student Deleted", description: `${studentName} has been deleted.`, variant: "destructive" })
      setDeleteStudentDialogOpen(false)
      setViewStudentDialogOpen(false)
    }
  }

  const handleMarkPaid = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (student && user?.tenantId) {
      const remaining = student.totalFees - student.paidFees
      if (remaining > 0) {
        addPayment({
          studentId: student.id,
          amount: remaining,
          date: new Date().toISOString(),
          method: "cash",
          status: "completed",
        })
        const updatedStudents = getStudentsByBatch(user.tenantId, selectedBatch)
        setStudents(updatedStudents)
        setStats(getTenantStats(user.tenantId))
        loadAIInsights(updatedStudents, user.tenantId)
        toast({ title: "Payment Recorded", description: `Full payment of ₹${remaining.toLocaleString()} recorded.` })
      }
      setViewStudentDialogOpen(false)
    }
  }

  const handleSendReminder = (studentName: string) => {
    toast({
      title: "Reminder Sent",
      description: `Personalized AI reminder has been sent to ${studentName}.`,
    })
  }

  const handleBulkReminders = () => {
    toast({
      title: "Bulk Reminders Triggered",
      description: `AI is sending reminders to all scheduled recipients.`,
    })
  }

  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStaffLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await createStaffUser(email, password, name, user?.tenantId || "")
      setStaffList(getUsersByTenant(user?.tenantId || "").filter((u) => u.role === "staff"))
      setStaffDialogOpen(false)
      toast({ title: "Staff Created", description: `${name} can now login with their email.` })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setStaffLoading(false)
    }
  }

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setViewStudentDialogOpen(true)
  }

  const handleCreateBatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const batchName = formData.get("batchName") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    
    if (user?.tenantId) {
      addBatch({
        name: batchName,
        tenantId: user.tenantId,
        startDate,
        endDate,
      })
      setBatches(getBatchesByTenant(user.tenantId))
      toast({
        title: "Batch Created",
        description: `Academic batch ${batchName} has been created successfully.`,
      })
    }
    setBatchDialogOpen(false)
  }

  const handleDeleteBatch = (batchName: string) => {
    const batch = getAllBatchesByTenant(user?.tenantId || "").find((b) => b.name === batchName)
    if (batch && user?.tenantId) {
      // Check if batch has students
      const batchStudents = getStudentsByBatch(user.tenantId, batchName)
      if (batchStudents.length > 0) {
        toast({
          title: "Cannot Delete",
          description: `Cannot delete batch ${batchName} as it has ${batchStudents.length} students.`,
          variant: "destructive",
        })
        return
      }
      deleteBatch(batch.id)
      setBatches(getBatchesByTenant(user.tenantId))
      toast({
        title: "Batch Deleted",
        description: `Batch ${batchName} has been deleted.`,
        variant: "destructive",
      })
    }
  }

  const handleAddFeeHead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (user?.tenantId) {
      addFeeHead({
        tenantId: user.tenantId,
        name: formData.get("headName") as string,
        amount: Number(formData.get("amount")),
        isMandatory: formData.get("isMandatory") === "true",
      })
      setFeeHeads(getFeeHeadsByTenant(user.tenantId))
      toast({
        title: "Fee Head Added",
        description: `${formData.get("headName")} has been added to the fee structure.`,
      })
    }
    setFeeHeadDialogOpen(false)
  }

  const handleEditFeeHead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFeeHead) return
    const formData = new FormData(e.currentTarget)
    const updated = updateFeeHead(selectedFeeHead.id, {
      name: formData.get("headName") as string,
      amount: Number(formData.get("amount")),
      isMandatory: formData.get("isMandatory") === "true",
    })
    if (updated && user?.tenantId) {
      setFeeHeads(getFeeHeadsByTenant(user.tenantId))
      toast({ title: "Fee Head Updated", description: `${updated.name} has been updated.` })
      setEditFeeHeadDialogOpen(false)
      setSelectedFeeHead(null)
    }
  }

  const handleDeleteFeeHead = (id: string) => {
    const feeHead = feeHeads.find((f) => f.id === id)
    if (feeHead) {
      if (deleteFeeHead(id) && user?.tenantId) {
        setFeeHeads(getFeeHeadsByTenant(user.tenantId))
        toast({ title: "Fee Head Deleted", description: `${feeHead.name} has been deleted.`, variant: "destructive" })
      }
    }
  }

  const handleRemoveStaff = (staffId: string, staffName: string) => {
    // In real app, we'd have deleteStaff function
    if (user?.tenantId) {
      setStaffList(getUsersByTenant(user.tenantId).filter((u) => u.role === "staff" && u.id !== staffId))
      toast({
        title: "Staff Removed",
        description: `${staffName} has been removed from the system.`,
        variant: "destructive",
      })
    }
  }

  const handleCardClick = (type: string, data?: any) => {
    setSelectedCardData({ type, data: data || null })
    setCardDetailDialogOpen(true)
  }

  const handleCreateCampaign = () => {
    setCampaignDialogOpen(true)
  }

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Export Started",
      description: `${reportType} report is being generated and will download shortly.`,
    })
  }

  const handleApproveDiscount = (id: string) => {
    const updated = updateDiscountStatus(id, "approved")
    if (updated && user?.tenantId) {
      setDiscountRequests(getDiscountRequestsByTenant(user.tenantId))
      toast({ title: "Discount Approved", description: "Discount has been approved and applied." })
    }
  }

  const handleRejectDiscount = (id: string) => {
    const updated = updateDiscountStatus(id, "rejected")
    if (updated && user?.tenantId) {
      setDiscountRequests(getDiscountRequestsByTenant(user.tenantId))
      toast({ title: "Discount Rejected", description: "Discount request has been rejected." })
    }
  }

  const handleApproveRefund = (id: string) => {
    const updated = updateRefundStatus(id, "approved")
    if (updated && user?.tenantId) {
      setRefunds(getRefundsByTenant(user.tenantId))
      toast({ title: "Refund Approved", description: "Refund has been approved for processing." })
    }
  }

  const handleProcessRefund = (id: string) => {
    const updated = updateRefundStatus(id, "processed")
    if (updated && user?.tenantId) {
      setRefunds(getRefundsByTenant(user.tenantId))
      toast({ title: "Refund Processed", description: "Refund has been processed successfully." })
    }
  }

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (user?.tenantId) {
      addExpense({
        tenantId: user.tenantId,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        amount: Number(formData.get("amount")),
        date: formData.get("date") as string,
        createdBy: user.id,
      })
      setExpenses(getExpensesByTenant(user.tenantId))
      setExpenseDialogOpen(false)
      toast({ title: "Expense Added", description: "Expense has been recorded successfully." })
    }
  }

  const handleUploadDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get("file") as File
    if (file && selectedStudent && user?.tenantId) {
      addDocument({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        name: formData.get("name") as string,
        type: formData.get("type") as Document["type"],
        fileUrl: URL.createObjectURL(file),
        uploadedDate: new Date().toISOString(),
        uploadedBy: user.id,
        size: file.size,
      })
      setDocuments(getDocumentsByTenant(user.tenantId))
      setDocumentDialogOpen(false)
      toast({ title: "Document Uploaded", description: "Document has been uploaded successfully." })
    }
  }

  const handleUpdateStudentProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedStudent) {
      const photoFile = formData.get("photo") as File
      updateStudentProfile(selectedStudent.id, {
        photoUrl: photoFile ? URL.createObjectURL(photoFile) : selectedStudent.photoUrl,
        address: formData.get("address") as string,
        guardianName: formData.get("guardianName") as string,
        guardianRelation: formData.get("guardianRelation") as string,
        guardianPhone: formData.get("guardianPhone") as string,
        emergencyContact: formData.get("emergencyContact") as string,
        bloodGroup: formData.get("bloodGroup") as string,
        aadharNumber: formData.get("aadharNumber") as string,
      })
      if (user?.tenantId) {
        const updatedStudents = getStudentsByBatch(user.tenantId, selectedBatch)
        setStudents(updatedStudents)
      }
      setStudentProfileDialogOpen(false)
      toast({ title: "Profile Updated", description: "Student profile has been updated successfully." })
    }
  }

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar onSectionChange={setActiveSection} onCollapseChange={setSidebarCollapsed} />
      <main className={cn("transition-all duration-300 pt-20", !sidebarCollapsed && "md:ml-64")}>
        {activeSection === "dashboard" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{user.tenantName || "Institute"} Dashboard</h1>
                <p className="text-muted-foreground">Overview of your institute's fee management and insights</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card 
                className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setStudentsListDialogOpen(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalStudents}</div>
                  <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Click to view all students
                  </div>
                </CardContent>
              </Card>
              <Card 
                className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => {
                  setActiveSection("reports")
                  handleCardClick("revenue", { total: stats.totalRevenue, pending: stats.pendingAmount })
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Click for reports
                  </div>
                </CardContent>
              </Card>
              <Card 
                className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => {
                  setActiveSection("analytics")
                  handleCardClick("predicted", { predicted: predictedRevenue })
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    AI Predicted Revenue
                  </CardTitle>
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    ₹{predictedRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Click for analytics</p>
                </CardContent>
              </Card>
              <Card 
                className="border-none shadow-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => {
                  const defaulters = user?.tenantId ? getDefaultersByTenant(user.tenantId) : []
                  handleCardClick("defaulters", { defaulters, count: stats.defaulters })
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Defaulters</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.defaulters}</div>
                  <div className="flex items-center text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Click to view details
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-none shadow-sm cursor-pointer hover:shadow-lg transition-all" onClick={() => setActiveSection("analytics")}>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                  <p className="text-xs text-muted-foreground">Click to view detailed insights</p>
                </CardHeader>
                <CardContent>
                  <AIInsightsPanel insights={aiInsights.slice(0, 3)} />
                  <Button variant="ghost" className="w-full mt-4">View All Insights</Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm cursor-pointer hover:shadow-lg transition-all" onClick={() => setActiveSection("communication")}>
                <CardHeader>
                  <CardTitle>AI Reminder Schedule</CardTitle>
                  <p className="text-xs text-muted-foreground">Click to manage reminders</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reminders.slice(0, 3).map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{reminder.studentName}</p>
                          <p className="text-xs text-muted-foreground">{reminder.channel} • {new Date(reminder.scheduledDate).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="secondary">{reminder.status}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4">View All Reminders</Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Revenue Collection Trend</CardTitle>
                      <p className="text-xs text-muted-foreground">Monthly collection vs targets</p>
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-none">
                      AI-Powered Analysis
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
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
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--accent)"
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Fee Collection Mix</CardTitle>
                  <p className="text-xs text-muted-foreground">Distribution by payment status</p>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={feeTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {feeTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold">75%</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Collected</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {feeTypeData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI-Optimized Reminder Schedule</CardTitle>
                <Button size="sm" onClick={handleBulkReminders}>
                  <Send className="mr-2 h-4 w-4" />
                  Send All
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reminders.map((reminder, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{reminder.studentName}</TableCell>
                        <TableCell>{new Date(reminder.scheduledDate).toLocaleDateString()}</TableCell>
                        <TableCell className="capitalize">{reminder.channel}</TableCell>
                        <TableCell className="max-w-xs truncate">{reminder.message}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{reminder.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleSendReminder(reminder.studentName)}>
                            Send Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "students" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-muted-foreground">View and manage all student records.</p>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1 border">
                    <span className="text-xs font-bold text-muted-foreground">BATCH:</span>
                    <select
                      className="bg-transparent text-sm font-bold focus:outline-none"
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                      {batches.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rollNumber">Roll Number</Label>
                        <Input id="rollNumber" name="rollNumber" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" placeholder="+91..." required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Input id="class" name="class" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" name="dob" type="date" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalFees">Total Fees</Label>
                        <Input id="totalFees" name="totalFees" type="number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" name="dueDate" type="date" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Student
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalStudents}</div>
                  <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4% from last batch
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs last month
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    AI Predicted Revenue
                  </CardTitle>
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    ₹{predictedRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Expected by end of June</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Defaulters</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.defaulters}</div>
                  <div className="flex items-center text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Action required for 3 students
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Revenue Collection Trend</CardTitle>
                      <p className="text-xs text-muted-foreground">Monthly collection vs targets</p>
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-none">
                      AI-Powered Analysis
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
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
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--accent)"
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Fee Collection Mix</CardTitle>
                  <p className="text-xs text-muted-foreground">Distribution by payment status</p>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={feeTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {feeTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold">75%</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Collected</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {feeTypeData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Student Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFullscreenCard("student")}
                      title="Fullscreen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleExportReport("Student List")}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Total Fees</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>₹{student.totalFees.toLocaleString()}</TableCell>
                          <TableCell>₹{student.paidFees.toLocaleString()}</TableCell>
                          <TableCell>{new Date(student.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "paid"
                                  ? "default"
                                  : student.status === "overdue"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleViewStudent(student)}>
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setEditStudentDialogOpen(true)
                                }}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setDeleteStudentDialogOpen(true)
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Batch Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFullscreenCard("batch")}
                      title="Fullscreen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> New Batch
                        </Button>
                      </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Batch</DialogTitle>
                        <DialogDescription>Add a new academic year batch</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateBatch} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="batchName">Batch Name (Academic Year)</Label>
                          <Input id="batchName" name="batchName" placeholder="2025-26" required />
                        </div>
                        <Button type="submit" className="w-full">
                          Create Batch
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {batches.map((batch) => (
                      <Card key={batch} className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{batch}</h3>
                          <p className="text-xs text-muted-foreground">Active academic year</p>
                        </div>
                        <Badge>Active</Badge>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Fee Structure</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFullscreenCard("fee")}
                      title="Fullscreen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Dialog open={feeHeadDialogOpen} onOpenChange={setFeeHeadDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Add Head
                        </Button>
                      </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Fee Head</DialogTitle>
                        <DialogDescription>Create a new fee category</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddFeeHead} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="headName">Fee Head Name</Label>
                          <Input id="headName" name="headName" placeholder="e.g. Library Fee" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (₹)</Label>
                          <Input id="amount" name="amount" type="number" placeholder="5000" required />
                        </div>
                        <Button type="submit" className="w-full">
                          Add Fee Head
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Head Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeHeads.map((head) => (
                        <TableRow key={head.id}>
                          <TableCell className="font-medium">{head.name}</TableCell>
                          <TableCell>₹{head.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={head.isMandatory ? "default" : "secondary"}>
                              {head.isMandatory ? "Mandatory" : "Optional"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedFeeHead(head)
                                  setEditFeeHeadDialogOpen(true)
                                }}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteFeeHead(head.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI-Optimized Reminder Schedule</CardTitle>
                <Button size="sm" onClick={handleBulkReminders}>
                  <Send className="mr-2 h-4 w-4" />
                  Send All
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reminders.map((reminder, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{reminder.studentName}</TableCell>
                        <TableCell>{new Date(reminder.scheduledDate).toLocaleDateString()}</TableCell>
                        <TableCell className="capitalize">{reminder.channel}</TableCell>
                        <TableCell className="max-w-xs truncate">{reminder.message}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{reminder.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleSendReminder(reminder.studentName)}>
                            Send Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <AIInsightsPanel insights={aiInsights} />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Ask AI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="e.g., show defaulters, total collection"
                      value={nlQuery}
                      onChange={(e) => setNlQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNLQuery()}
                    />
                    <Button onClick={handleNLQuery} disabled={loadingAI} className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      {loadingAI ? "Processing..." : "Ask"}
                    </Button>
                  </div>
                  {nlResponse && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm">{nlResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === "staff" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Staff & Teacher Management</h2>
                <p className="text-muted-foreground">Create accounts for your faculty and administration team.</p>
              </div>
              <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Staff Account</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddStaff} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="staff-name">Full Name</Label>
                      <Input id="staff-name" name="name" placeholder="Prof. Jane Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-email">Email Address</Label>
                      <Input id="staff-email" name="email" type="email" placeholder="jane@institute.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="staff-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={staffLoading}>
                      {staffLoading ? "Creating..." : "Create Account"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffList.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-bold">{staff.name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {staff.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(staff.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                toast({ title: "Staff Management", description: `Manage ${staff.name}` })
                              }}
                            >
                              Manage
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveStaff(staff.id, staff.name)}
                            >
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {staffList.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                          No staff accounts created yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "communication" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle>AI Campaign Management</CardTitle>
                  <p className="text-xs text-muted-foreground">Automated fee reminders and announcements</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Quarter 2 Due Reminder",
                        audience: "All Students",
                        channel: "WhatsApp",
                        status: "Active",
                      },
                      { title: "Transport Fee Alert", audience: "Bus Users", channel: "SMS", status: "Scheduled" },
                    ].map((campaign, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border border-border/50 rounded-2xl hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            {campaign.channel === "WhatsApp" ? (
                              <MessageCircle className="w-5 h-5 text-accent" />
                            ) : (
                              <Smartphone className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{campaign.title}</div>
                            <p className="text-xs text-muted-foreground">
                              {campaign.audience} • {campaign.channel}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-accent/10 text-accent border-none">
                          {campaign.status}
                        </Badge>
                      </div>
                    ))}
                    <Button className="w-full rounded-full gap-2 py-6" onClick={handleCreateCampaign}>
                      <Plus className="w-4 h-4" />
                      Create New AI Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-wider text-accent font-bold">Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-card rounded-3xl p-6 border shadow-sm relative max-w-[240px] mx-auto overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-accent" />
                      <div className="text-[10px] font-bold">FeeSmart Bot</div>
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-[11px] leading-relaxed mb-4">
                      Hello Aditya! 📚 Just a friendly reminder that your tuition fee for Q2 is due on June 15th. Would
                      you like to pay now?
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="bg-accent/10 text-accent text-center py-2 rounded-xl text-[10px] font-bold cursor-pointer hover:bg-accent/20 transition-colors">
                        Pay Fee Now
                      </div>
                      <div className="bg-muted text-center py-2 rounded-xl text-[10px] font-bold">Talk to Support</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground mt-4 italic">
                    AI optimizes delivery time based on student activity.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Add new section for Advanced Analytics in the switch statement */}
        {activeSection === "analytics" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Advanced Analytics & AI Insights</h2>
              <p className="text-muted-foreground">Monitor AI-powered analytics and predictive insights</p>
            </div>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>6-Month Revenue Forecast</CardTitle>
                  <Badge className="bg-accent/10 text-accent border-none">AI Powered</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Jan", actual: 125000, forecast: 128000 },
                        { month: "Feb", actual: 132000, forecast: 135000 },
                        { month: "Mar", actual: null, forecast: 142000 },
                        { month: "Apr", null: null, forecast: 148000 },
                        { month: "May", null: null, forecast: 155000 },
                        { month: "Jun", null: null, forecast: 162000 },
                      ]}
                    >
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--accent)"
                        fill="var(--accent)"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke="var(--primary)"
                        strokeDasharray="5 5"
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Payment Reconciliation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Expected Amount</TableHead>
                      <TableHead>Received Amount</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentReconciliation.map((record, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell className="font-medium">₹{record.expected.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">₹{record.received.toLocaleString()}</TableCell>
                        <TableCell
                          className={
                            record.received < record.expected
                              ? "text-destructive font-medium"
                              : "text-emerald-600 font-medium"
                          }
                        >
                          ₹{(record.expected - record.received).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.status === "completed" ? "default" : "secondary"}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Student Financial Health Scores</CardTitle>
                <p className="text-xs text-muted-foreground">AI-powered risk assessment for payment defaults</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Aditya Sharma", score: 95, risk: "Low", trend: "↑" },
                    { name: "Priya Patel", score: 65, risk: "Medium", trend: "↓" },
                    { name: "Rajesh Kumar", score: 35, risk: "High", trend: "↓" },
                    { name: "Neha Singh", score: 78, risk: "Low", trend: "↑" },
                  ].map((student) => (
                    <div
                      key={student.name}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{student.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden max-w-xs">
                            <div
                              className={`h-full ${
                                student.score >= 80
                                  ? "bg-emerald-500"
                                  : student.score >= 50
                                    ? "bg-yellow-500"
                                    : "bg-destructive"
                              }`}
                              style={{ width: `${student.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold w-8">{student.score}%</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <Badge
                          variant={
                            student.risk === "Low" ? "default" : student.risk === "Medium" ? "secondary" : "destructive"
                          }
                        >
                          {student.risk}
                        </Badge>
                        <p className="text-xs mt-1 font-semibold">{student.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "reports" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Financial Reports</h2>
              <p className="text-muted-foreground">Generate comprehensive financial and collection reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">All time</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Pending Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    ₹{stats.pendingAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">To be collected</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Collection Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {((stats.totalRevenue / (stats.totalRevenue + stats.pendingAmount)) * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Efficiency rate</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Defaulters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.defaulters}</div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">Require attention</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Collection Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed collection report with date range, batch-wise, and class-wise breakdown.
                  </p>
                  <Button className="w-full" onClick={() => handleExportReport("Collection Report")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Batch-wise Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive report showing collection statistics for each academic batch.
                  </p>
                  <Button className="w-full" onClick={() => handleExportReport("Batch-wise Report")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Defaulters Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    List of students with overdue payments, pending amounts, and days overdue.
                  </p>
                  <Button className="w-full" onClick={() => handleExportReport("Defaulters Report")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Class-wise Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Collection statistics broken down by class with payment status distribution.
                  </p>
                  <Button className="w-full" onClick={() => handleExportReport("Class-wise Report")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>P&L Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Profit & Loss statement showing income from fees and expenses for the institute.
                  </p>
                  <Button className="w-full" onClick={() => handleExportReport("P&L Statement")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Fee Head Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Collection breakdown by fee head (Tuition, Library, Transport, etc.)
                  </p>
                  <Button className="w-full" onClick={() => handleExportReport("Fee Head Report")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Generated Date</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Monthly Collection Report", date: "2025-01-20", format: "PDF" },
                      { name: "Batch-wise Report 2024-25", date: "2025-01-18", format: "Excel" },
                      { name: "Defaulters List", date: "2025-01-15", format: "PDF" },
                    ].map((report, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{report.format}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleExportReport(report.name)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Settings & Configuration</h2>
              <p className="text-muted-foreground">Manage institute settings, payment gateways, and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Institute Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Institute Name</Label>
                    <Input defaultValue={user?.tenantName || ""} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" defaultValue="admin@school.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue="+91 9876543210" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea rows={3} defaultValue="123 Education Street, City, State - 123456" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Payment Gateways</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Razorpay", enabled: true },
                      { name: "PayU", enabled: false },
                      { name: "Cashfree", enabled: true },
                    ].map((gateway) => (
                      <div key={gateway.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{gateway.name}</span>
                        <Badge variant={gateway.enabled ? "default" : "secondary"}>
                          {gateway.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">Configure Gateways</Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Send email alerts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Send SMS alerts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>WhatsApp Notifications</Label>
                      <p className="text-xs text-muted-foreground">Send WhatsApp messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Discount & Concession Requests</CardTitle>
                <Badge variant="secondary">{discountRequests.filter((d) => d.status === "pending").length} Pending</Badge>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discountRequests.length > 0 ? (
                      discountRequests.map((discount) => (
                        <TableRow key={discount.id}>
                          <TableCell className="font-medium">{discount.studentName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{discount.discountType}</Badge>
                          </TableCell>
                          <TableCell>₹{discount.amount.toLocaleString()}</TableCell>
                          <TableCell className="max-w-xs truncate">{discount.reason}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                discount.status === "approved" ? "default" : discount.status === "rejected" ? "destructive" : "secondary"
                              }
                            >
                              {discount.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {discount.status === "pending" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveDiscount(discount.id)}
                                  className="text-emerald-600 hover:text-emerald-700"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRejectDiscount(discount.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No discount requests
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Refund Management</CardTitle>
                <Badge variant="secondary">{refunds.filter((r) => r.status === "pending").length} Pending</Badge>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refunds.length > 0 ? (
                      refunds.map((refund) => (
                        <TableRow key={refund.id}>
                          <TableCell className="font-medium">{refund.studentName}</TableCell>
                          <TableCell className="font-bold">₹{refund.amount.toLocaleString()}</TableCell>
                          <TableCell className="max-w-xs truncate">{refund.reason}</TableCell>
                          <TableCell>{new Date(refund.requestedDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                refund.status === "processed" ? "default" : refund.status === "rejected" ? "destructive" : "secondary"
                              }
                            >
                              {refund.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {refund.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveRefund(refund.id)}
                                className="text-emerald-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {refund.status === "approved" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleProcessRefund(refund.id)}
                                className="text-emerald-600"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Process
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No refund requests
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expense Management</CardTitle>
                <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="Staff Salary">Staff Salary</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" placeholder="Enter expense description" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Amount (₹)</Label>
                          <Input name="amount" type="number" required />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Add Expense</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length > 0 ? (
                      expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{expense.category}</Badge>
                          </TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell className="text-right font-bold">₹{expense.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No expenses recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {expenses.length > 0 && (
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-bold">Total Expenses</span>
                    <span className="text-2xl font-bold text-destructive">
                      ₹{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <p className="text-xs text-muted-foreground">Track all system activities and changes</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {activityLogs.length > 0 ? (
                    activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{log.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {log.action} {log.entityType} {log.details && `- ${log.details}`}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No activity logs</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Payment Plans & Installments</CardTitle>
                <p className="text-xs text-muted-foreground">Track and manage student payment installments</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Installments</TableHead>
                      <TableHead>Monthly Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentPlans.length > 0 ? (
                      paymentPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.studentName}</TableCell>
                          <TableCell>₹{plan.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>{plan.installments}</TableCell>
                          <TableCell>₹{plan.monthlyAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            {plan.paidInstallments}/{plan.installments}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                plan.status === "completed" ? "default" : plan.status === "defaulted" ? "destructive" : "secondary"
                              }
                            >
                              {plan.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: "View Details", description: "Payment plan details" })}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No active payment plans
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Late Fee & Penalty Management</CardTitle>
                <p className="text-xs text-muted-foreground">Automatic late fee calculation and tracking</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-none bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Late Fee Rate</div>
                        <div className="text-2xl font-bold">2%</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Grace Period</div>
                        <div className="text-2xl font-bold">7</div>
                        <div className="text-xs text-muted-foreground">days</div>
                      </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Total Late Fees</div>
                        <div className="text-2xl font-bold text-destructive">
                          ₹{students
                            .filter((s) => s.status === "overdue")
                            .reduce((sum, s) => {
                              const overdueAmount = s.totalFees - s.paidFees
                              const dueDate = new Date(s.dueDate)
                              const today = new Date()
                              const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) - 7)
                              const monthsOverdue = Math.floor(daysOverdue / 30)
                              return sum + overdueAmount * 0.02 * monthsOverdue
                            }, 0)
                            .toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Overdue Amount</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Late Fee</TableHead>
                      <TableHead>Total Due</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students
                      .filter((s) => {
                        const dueDate = new Date(s.dueDate)
                        const today = new Date()
                        return today > dueDate && s.status !== "paid"
                      })
                      .map((student) => {
                        const overdueAmount = student.totalFees - student.paidFees
                        const dueDate = new Date(student.dueDate)
                        const today = new Date()
                        const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) - 7)
                        const monthsOverdue = Math.floor(daysOverdue / 30)
                        const lateFee = overdueAmount * 0.02 * monthsOverdue
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>₹{overdueAmount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{daysOverdue} days</Badge>
                            </TableCell>
                            <TableCell className="font-bold text-destructive">₹{lateFee.toLocaleString()}</TableCell>
                            <TableCell className="font-bold">₹{(overdueAmount + lateFee).toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => toast({ title: "Send Reminder", description: `Late fee reminder sent to ${student.name}` })}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    {students.filter((s) => {
                      const dueDate = new Date(s.dueDate)
                      const today = new Date()
                      return today > dueDate && s.status !== "paid"
                    }).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No late fee cases
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Document Management</CardTitle>
                <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => {
                      if (!selectedStudent) {
                        toast({ title: "Select Student", description: "Please select a student first", variant: "destructive" })
                        return
                      }
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Document</DialogTitle>
                      <DialogDescription>Upload a document for {selectedStudent?.name || "student"}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUploadDocument} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Document Name</Label>
                        <Input name="name" placeholder="e.g. Class 10 Marksheet" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Document Type</Label>
                        <Select name="type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admit_card">Admit Card</SelectItem>
                            <SelectItem value="marksheet">Marksheet</SelectItem>
                            <SelectItem value="certificate">Certificate</SelectItem>
                            <SelectItem value="id_proof">ID Proof</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>File</Label>
                        <Input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                      </div>
                      <Button type="submit" className="w-full">Upload Document</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length > 0 ? (
                      documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.studentName}</TableCell>
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{doc.type.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell>{new Date(doc.uploadedDate).toLocaleDateString()}</TableCell>
                          <TableCell>{(doc.size / 1024).toFixed(1)} KB</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => window.open(doc.fileUrl, "_blank")}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No documents uploaded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={viewStudentDialogOpen} onOpenChange={setViewStudentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-semibold">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Roll Number</p>
                  <p className="font-semibold">{selectedStudent.rollNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="font-semibold">{selectedStudent.class}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Batch</p>
                  <p className="font-semibold">{selectedStudent.batch}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Fees</p>
                  <p className="font-semibold">₹{selectedStudent.totalFees.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="font-semibold text-accent">₹{selectedStudent.paidFees.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={selectedStudent.status === "paid" ? "default" : "destructive"} className="mt-1">
                  {selectedStudent.status}
                </Badge>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => handleMarkPaid(selectedStudent.id)}>
                  Mark as Paid
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleSendReminder(selectedStudent.name)}
                >
                  Send Reminder
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setEditStudentDialogOpen(true)
                    setViewStudentDialogOpen(false)
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent text-destructive border-destructive/20 hover:bg-destructive/10"
                  onClick={() => {
                    setDeleteStudentDialogOpen(true)
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editStudentDialogOpen} onOpenChange={setEditStudentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student information</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" name="name" defaultValue={selectedStudent.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rollNumber">Roll Number</Label>
                  <Input id="edit-rollNumber" name="rollNumber" defaultValue={selectedStudent.rollNumber} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={selectedStudent.email} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input id="edit-phone" name="phone" defaultValue={selectedStudent.phone} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-class">Class</Label>
                  <Input id="edit-class" name="class" defaultValue={selectedStudent.class} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dob">Date of Birth</Label>
                  <Input id="edit-dob" name="dob" type="date" defaultValue={selectedStudent.dateOfBirth} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-totalFees">Total Fees</Label>
                  <Input id="edit-totalFees" name="totalFees" type="number" defaultValue={selectedStudent.totalFees} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input id="edit-dueDate" name="dueDate" type="date" defaultValue={selectedStudent.dueDate} required />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setEditStudentDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteStudentDialogOpen} onOpenChange={setDeleteStudentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDeleteStudent}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setDeleteStudentDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={studentsListDialogOpen} onOpenChange={setStudentsListDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Students ({students.length})</DialogTitle>
            <DialogDescription>
              Complete list of all students in your institute
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students found
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Total Fees</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const remaining = student.totalFees - student.paidFees
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>₹{student.totalFees.toLocaleString()}</TableCell>
                          <TableCell>₹{student.paidFees.toLocaleString()}</TableCell>
                          <TableCell>₹{remaining.toLocaleString()}</TableCell>
                          <TableCell>{new Date(student.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "paid"
                                  ? "default"
                                  : student.status === "overdue"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Student Management Card */}
      <Dialog open={fullscreenCard === "student"} onOpenChange={(open) => !open && setFullscreenCard(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Student Management</DialogTitle>
                <DialogDescription>Complete student records and management</DialogDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFullscreenCard(null)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4">
            <div className="mb-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleExportReport("Student List")}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Fees</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>₹{student.totalFees.toLocaleString()}</TableCell>
                      <TableCell>₹{student.paidFees.toLocaleString()}</TableCell>
                      <TableCell>{new Date(student.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "paid"
                              ? "default"
                              : student.status === "overdue"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewStudent(student)}>
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedStudent(student)
                              setEditStudentDialogOpen(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedStudent(student)
                              setDeleteStudentDialogOpen(true)
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Batch Management Card */}
      <Dialog open={fullscreenCard === "batch"} onOpenChange={(open) => !open && setFullscreenCard(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Batch Management</DialogTitle>
                <DialogDescription>Manage academic year batches</DialogDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFullscreenCard(null)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4">
            <div className="mb-4 flex justify-end">
              <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> New Batch
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Batch</DialogTitle>
                    <DialogDescription>Add a new academic year batch</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateBatch} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="batchNameFullscreen">Batch Name (Academic Year)</Label>
                      <Input id="batchNameFullscreen" name="batchName" placeholder="2025-26" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Batch
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {batches.map((batch) => (
                <Card key={batch} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{batch}</h3>
                    <p className="text-xs text-muted-foreground">Active academic year</p>
                  </div>
                  <Badge>Active</Badge>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Fee Structure Card */}
      <Dialog open={fullscreenCard === "fee"} onOpenChange={(open) => !open && setFullscreenCard(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Fee Structure</DialogTitle>
                <DialogDescription>Manage fee heads and structure</DialogDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFullscreenCard(null)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4">
            <div className="mb-4 flex justify-end">
              <Dialog open={feeHeadDialogOpen} onOpenChange={setFeeHeadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Head
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Fee Head</DialogTitle>
                    <DialogDescription>Create a new fee category</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddFeeHead} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="headNameFullscreen">Fee Head Name</Label>
                      <Input id="headNameFullscreen" name="headName" placeholder="e.g. Library Fee" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amountFullscreen">Amount (₹)</Label>
                      <Input id="amountFullscreen" name="amount" type="number" placeholder="5000" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Fee Head
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Head Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeHeads.map((head) => (
                    <TableRow key={head.id}>
                      <TableCell className="font-medium">{head.name}</TableCell>
                      <TableCell>₹{head.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={head.isMandatory ? "default" : "secondary"}>
                          {head.isMandatory ? "Mandatory" : "Optional"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedFeeHead(head)
                              setEditFeeHeadDialogOpen(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteFeeHead(head.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editFeeHeadDialogOpen} onOpenChange={setEditFeeHeadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Fee Head</DialogTitle>
            <DialogDescription>Update fee head information</DialogDescription>
          </DialogHeader>
          {selectedFeeHead && (
            <form onSubmit={handleEditFeeHead} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-headName">Fee Head Name</Label>
                <Input id="edit-headName" name="headName" defaultValue={selectedFeeHead.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount (₹)</Label>
                <Input id="edit-amount" name="amount" type="number" defaultValue={selectedFeeHead.amount} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-isMandatory">Fee Type</Label>
                <Select name="isMandatory" defaultValue={selectedFeeHead.isMandatory ? "true" : "false"} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Mandatory</SelectItem>
                    <SelectItem value="false">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setEditFeeHeadDialogOpen(false)
                    setSelectedFeeHead(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={studentProfileDialogOpen} onOpenChange={setStudentProfileDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>Update student profile information and upload photo</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <form onSubmit={handleUpdateStudentProfile} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {selectedStudent.photoUrl ? (
                    <img src={selectedStudent.photoUrl} alt={selectedStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="photo">Upload Photo</Label>
                  <Input id="photo" name="photo" type="file" accept="image/*" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Guardian Name</Label>
                  <Input name="guardianName" defaultValue={selectedStudent.guardianName || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Guardian Relation</Label>
                  <Select name="guardianRelation" defaultValue={selectedStudent.guardianRelation || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Guardian Phone</Label>
                  <Input name="guardianPhone" defaultValue={selectedStudent.guardianPhone || selectedStudent.parentContact} />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  <Input name="emergencyContact" defaultValue={selectedStudent.emergencyContact || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea name="address" rows={3} defaultValue={selectedStudent.address || ""} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select name="bloodGroup" defaultValue={selectedStudent.bloodGroup || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Aadhar Number</Label>
                  <Input name="aadharNumber" defaultValue={selectedStudent.aadharNumber || ""} maxLength={12} />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setStudentProfileDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create AI Campaign</DialogTitle>
            <DialogDescription>Set up an automated reminder campaign</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input placeholder="End-of-month fee reminder" />
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input placeholder="All pending students" />
            </div>
            <div className="space-y-2">
              <Label>Schedule Date</Label>
              <Input type="date" />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                toast({ title: "Campaign Created", description: "AI campaign has been scheduled successfully." })
                setCampaignDialogOpen(false)
              }}
            >
              Launch Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={cardDetailDialogOpen} onOpenChange={setCardDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCardData?.type === "students" && "Student Details"}
              {selectedCardData?.type === "defaulters" && "Defaulter Details"}
              {selectedCardData?.type === "revenue" && "Revenue Details"}
              {selectedCardData?.type === "predicted" && "Revenue Prediction"}
              {selectedCardData?.type === "batch" && "Batch Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedCardData?.type === "students" && "View all student records"}
              {selectedCardData?.type === "defaulters" && "Students with overdue payments"}
              {selectedCardData?.type === "revenue" && "Revenue and collection details"}
              {selectedCardData?.type === "predicted" && "AI-powered revenue forecast"}
              {selectedCardData?.type === "batch" && "Batch information and students"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCardData?.type === "defaulters" && selectedCardData.data?.defaulters && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Pending Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCardData.data.defaulters.map((student: Student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell className="font-bold text-destructive">
                        ₹{(student.totalFees - student.paidFees).toLocaleString()}
                      </TableCell>
                      <TableCell>{new Date(student.dueDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {selectedCardData?.type === "batch" && selectedCardData.data?.batch && (
              <div>
                <h3 className="font-bold text-lg mb-4">{selectedCardData.data.batch}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedCardData.data.students?.length || 0} students in this batch
                </p>
                {selectedCardData.data.students && selectedCardData.data.students.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCardData.data.students.map((student: Student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            <Badge variant={student.status === "paid" ? "default" : student.status === "overdue" ? "destructive" : "secondary"}>
                              {student.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
            {selectedCardData?.type === "revenue" && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Revenue</span>
                      <span className="text-2xl font-bold">₹{selectedCardData.data?.total?.toLocaleString() || 0}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pending Amount</span>
                      <span className="text-2xl font-bold text-destructive">
                        ₹{selectedCardData.data?.pending?.toLocaleString() || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {selectedCardData?.type === "predicted" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">AI Predicted Revenue</p>
                    <p className="text-3xl font-bold">₹{selectedCardData.data?.predicted?.toLocaleString() || 0}</p>
                    <p className="text-xs text-muted-foreground mt-2">Expected by end of current month</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
