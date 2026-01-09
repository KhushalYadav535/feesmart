"use client"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getStudentsByTenant, getDefaultersByTenant, type Student } from "@/lib/auth"
import {
  Users,
  ClipboardList,
  AlertCircle,
  Search,
  TrendingUp,
  Bell,
  Sparkles,
  MessageSquare,
  Download,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Suspense } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function StaffDashboardContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [defaulters, setDefaulters] = useState<Student[]>([])
  const [search, setSearch] = useState("")
  const [bulkAttendanceOpen, setBulkAttendanceOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [riskAssessment, setRiskAssessment] = useState<
    Array<{ studentName: string; riskScore: number; riskLevel: string; recommendation: string }>
  >([
    {
      studentName: "Rajesh Kumar",
      riskScore: 85,
      riskLevel: "High",
      recommendation: "Immediate intervention required",
    },
    { studentName: "Priya Patel", riskScore: 65, riskLevel: "Medium", recommendation: "Schedule counseling" },
  ])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "staff")) {
      router.push("/auth/login")
    }
    if (user?.tenantId) {
      setStudents(getStudentsByTenant(user.tenantId))
      setDefaulters(getDefaultersByTenant(user.tenantId))
    }
  }, [user, isLoading, router])

  const handleAttendance = (studentName: string, status: "Present" | "Absent") => {
    toast({
      title: "Attendance Marked",
      description: `${studentName} marked as ${status}.`,
    })
  }

  const handleVerificationRequest = (studentName: string) => {
    toast({
      title: "Reminder Scheduled",
      description: `AI will send a gentle fee reminder to ${studentName}.`,
    })
  }

  const handleBulkAttendance = () => {
    setBulkAttendanceOpen(true)
  }

  const handleViewReports = () => {
    setReportDialogOpen(true)
  }

  const handleSubmitBulkAttendance = () => {
    toast({
      title: "Bulk Attendance Recorded",
      description: `Attendance for ${students.length} students has been marked successfully.`,
    })
    setBulkAttendanceOpen(false)
  }

  if (isLoading || !user) return null

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.includes(search),
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <Sidebar />
      <main className="ml-64 container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">Staff Portal</h1>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-none h-5">
                <Users className="w-3 h-3 mr-1" />
                Verified Staff
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Logged in as {user.name} • {user.tenantName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-card shadow-sm border-none" onClick={handleViewReports}>
              <ClipboardList className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <Button size="sm" className="shadow-lg shadow-accent/20" onClick={handleBulkAttendance}>
              Mark Attendance
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                My Students
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{students.length}</div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                Full strength assigned
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100 uppercase tracking-wider">
                Attendance Rate
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">94.2%</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Average for current week</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Sparkles className="h-12 w-12" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100 uppercase tracking-wider">
                Fee Defaulters
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">{defaulters.length}</div>
              <div className="flex items-center text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                <Bell className="h-3 w-3 mr-1" />
                Action required
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="bg-card/50 p-1 rounded-xl">
            <TabsTrigger value="attendance" className="rounded-lg px-6">
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger value="fee-help" className="rounded-lg px-6">
              Fee Verification
            </TabsTrigger>
            <TabsTrigger value="risk" className="rounded-lg px-6">
              Risk Assessment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Attendance List</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{new Date().toDateString()}</p>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-9 h-10 rounded-xl bg-muted/50 border-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="group transition-colors">
                        <TableCell className="font-mono text-xs">{student.rollNumber}</TableCell>
                        <TableCell className="font-semibold">{student.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{student.class}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-10 h-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 bg-transparent"
                              onClick={() => handleAttendance(student.name, "Present")}
                            >
                              P
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-10 h-10 rounded-xl hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 bg-transparent"
                              onClick={() => handleAttendance(student.name, "Absent")}
                            >
                              A
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fee-help">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Students with Pending Dues</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Staff can trigger AI reminders or log verbal discussions.
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Pending Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defaulters.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-semibold">{student.name}</TableCell>
                        <TableCell className="font-bold text-destructive">
                          ₹{(student.totalFees - student.paidFees).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(student.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="destructive"
                            className="bg-destructive/10 text-destructive border-none capitalize"
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl text-accent hover:bg-accent/5"
                            onClick={() => handleVerificationRequest(student.name)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Remind
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>AI-Powered Default Risk Assessment</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Predicted risk of payment defaults based on attendance and history
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskAssessment.map((assessment, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{assessment.studentName}</h3>
                        <Badge
                          variant={
                            assessment.riskLevel === "High"
                              ? "destructive"
                              : assessment.riskLevel === "Medium"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {assessment.riskLevel} Risk
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Risk Score</span>
                          <span className="font-bold">{assessment.riskScore}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              assessment.riskScore >= 70
                                ? "bg-destructive"
                                : assessment.riskScore >= 50
                                  ? "bg-yellow-500"
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${assessment.riskScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Recommended Action:</p>
                        <p className="text-xs text-muted-foreground">{assessment.recommendation}</p>
                      </div>
                      <Button size="sm" className="mt-3 w-full bg-transparent" variant="outline">
                        View Collection Strategy
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={bulkAttendanceOpen} onOpenChange={setBulkAttendanceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Bulk Attendance</DialogTitle>
              <DialogDescription>Record attendance for all students at once</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will mark all {students.length} students as present for today.
              </p>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSubmitBulkAttendance}>
                  Mark All Present
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setBulkAttendanceOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Reports</DialogTitle>
              <DialogDescription>Download attendance and fee collection reports</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  toast({ title: "Report Generated", description: "Attendance report downloaded successfully." })
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Attendance Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  toast({ title: "Report Generated", description: "Fee defaulters report downloaded successfully." })
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Fee Defaulters Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  toast({ title: "Report Generated", description: "Monthly summary report downloaded successfully." })
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Monthly Summary
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default function StaffDashboard() {
  return (
    <Suspense fallback={null}>
      <StaffDashboardContent />
    </Suspense>
  )
}
