export type UserRole = "super_admin" | "admin" | "staff" | "student" | "parent"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId?: string // null for super_admin, set for other roles
  tenantName?: string
  createdAt: string
}

export interface Tenant {
  id: string
  name: string
  adminId: string
  createdAt: string
  isActive: boolean
  plan: "basic" | "premium" | "enterprise"
  nextBillingDate: string
}

export interface Student {
  id: string
  name: string
  email: string
  rollNumber: string
  tenantId: string
  class: string
  totalFees: number
  paidFees: number
  dueDate: string
  status: "paid" | "pending" | "overdue"
  batch: string
  category: "regular" | "scholarship" | "hosteller"
  parentContact: string
  phone: string
  dateOfBirth: string // Format: YYYY-MM-DD
}

export interface Attendance {
  id: string
  studentId: string
  date: string
  status: "present" | "absent" | "late"
}

export interface FeeHead {
  id: string
  tenantId: string
  name: string
  amount: number
  isMandatory: boolean
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  date: string
  method: "cash" | "online" | "cheque"
  status: "completed" | "pending" | "failed"
}

// Mock database (in a real app, this would be in a database)
const mockUsers: User[] = [
  {
    id: "1",
    email: "super@feesmart.com",
    name: "Super Admin",
    role: "super_admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "admin@school.com",
    name: "School Admin",
    role: "admin",
    tenantId: "t1",
    tenantName: "Demo School",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "staff@school.com",
    name: "Staff Member",
    role: "staff",
    tenantId: "t1",
    tenantName: "Demo School",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    email: "student@school.com",
    name: "John Doe",
    role: "student",
    tenantId: "t1",
    tenantName: "Demo School",
    createdAt: new Date().toISOString(),
  },
]

const mockTenants: Tenant[] = [
  {
    id: "t1",
    name: "Demo School",
    adminId: "2",
    createdAt: new Date().toISOString(),
    isActive: true,
    plan: "premium",
    nextBillingDate: "2025-12-31",
  },
]

const mockStudents: Student[] = [
  {
    id: "s1",
    name: "John Doe",
    email: "john@student.com",
    rollNumber: "STU001",
    tenantId: "t1",
    class: "Class 10",
    totalFees: 50000,
    paidFees: 50000,
    dueDate: "2025-03-31",
    status: "paid",
    batch: "2024-25",
    category: "regular",
    parentContact: "+91 9876543210",
    phone: "+91 9876543210",
    dateOfBirth: "2010-05-15",
  },
  {
    id: "s2",
    name: "Jane Smith",
    email: "jane@student.com",
    rollNumber: "STU002",
    tenantId: "t1",
    class: "Class 10B",
    totalFees: 50000,
    paidFees: 25000,
    dueDate: "2025-02-28",
    status: "pending",
    batch: "2024-25",
    category: "regular",
    parentContact: "+91 9876543211",
    phone: "+91 9876543211",
    dateOfBirth: "2010-08-22",
  },
  {
    id: "s3",
    name: "Bob Wilson",
    email: "bob@student.com",
    rollNumber: "STU003",
    tenantId: "t1",
    class: "Class 9A",
    totalFees: 45000,
    paidFees: 10000,
    dueDate: "2025-01-15",
    status: "overdue",
    batch: "2024-25",
    category: "regular",
    parentContact: "+91 9876543212",
    phone: "+91 9876543212",
    dateOfBirth: "2011-03-10",
  },
]

const mockPayments: Payment[] = [
  {
    id: "p1",
    studentId: "s1",
    amount: 50000,
    date: "2025-01-10",
    method: "online",
    status: "completed",
  },
  {
    id: "p2",
    studentId: "s2",
    amount: 25000,
    date: "2025-01-15",
    method: "cash",
    status: "completed",
  },
  {
    id: "p3",
    studentId: "s3",
    amount: 10000,
    date: "2024-12-20",
    method: "cheque",
    status: "completed",
  },
]

const mockAttendance: Attendance[] = [
  { id: "a1", studentId: "s1", date: "2025-12-24", status: "present" },
  { id: "a2", studentId: "s2", date: "2025-12-24", status: "absent" },
]

const mockFeeHeads: FeeHead[] = [
  { id: "fh1", tenantId: "t1", name: "Tuition Fee", amount: 40000, isMandatory: true },
  { id: "fh2", tenantId: "t1", name: "Library Fee", amount: 5000, isMandatory: true },
  { id: "fh3", tenantId: "t1", name: "Transport Fee", amount: 15000, isMandatory: false },
]

// Mock password store (in real app, use bcrypt)
const mockPasswords: Record<string, string> = {
  "super@feesmart.com": "super123",
  "admin@school.com": "admin123",
  "staff@school.com": "staff123",
  "student@school.com": "student123",
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = mockUsers.find((u) => u.email === email)
  if (user && mockPasswords[email] === password) {
    return user
  }

  return null
}

export async function loginStudent(phone: string, dob: string): Promise<User | null> {
  // Use the main login function with normalization
  return loginStudentByPhoneDOB(phone, dob)
}

export async function login(user: User): Promise<void> {
  console.log(`[v0] Mock server login for user: ${user.email}`)
}

export async function logout(): Promise<void> {
  // This is a simplified version for the server action
  console.log("[v0] Mock server logout")
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  tenantName?: string,
): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if user already exists
  if (mockUsers.find((u) => u.email === email)) {
    throw new Error("User already exists")
  }

  let tenantId: string | undefined
  let finalTenantName: string | undefined

  if (role === "admin" && tenantName) {
    const newTenant: Tenant = {
      id: `t${mockTenants.length + 1}`,
      name: tenantName,
      adminId: `${mockUsers.length + 1}`,
      createdAt: new Date().toISOString(),
      isActive: true,
      plan: "basic",
      nextBillingDate: new Date().toISOString(),
    }
    mockTenants.push(newTenant)
    tenantId = newTenant.id
    finalTenantName = newTenant.name
  } else if (role !== "admin" && role !== "super_admin") {
    throw new Error("Only institutional accounts (Admins) can register directly.")
  }

  const newUser: User = {
    id: `${mockUsers.length + 1}`,
    email,
    name,
    role,
    tenantId,
    tenantName: finalTenantName,
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  mockPasswords[email] = password

  return newUser
}

export async function createStaffAccount(adminId: string, email: string, name: string, role: "staff"): Promise<User> {
  const admin = mockUsers.find((u) => u.id === adminId && u.role === "admin")
  if (!admin) throw new Error("Unauthorized")

  const newStaff: User = {
    id: `${mockUsers.length + 1}`,
    email,
    name,
    role,
    tenantId: admin.tenantId,
    tenantName: admin.tenantName,
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newStaff)
  mockPasswords[email] = "password123" // Default password
  return newStaff
}

export function getTenants(): Tenant[] {
  return mockTenants
}

export function getUsersByTenant(tenantId: string): User[] {
  return mockUsers.filter((u) => u.tenantId === tenantId)
}

export function getAllUsers(): User[] {
  return mockUsers
}

export function updateTenantStatus(tenantId: string, isActive: boolean): void {
  const tenant = mockTenants.find((t) => t.id === tenantId)
  if (tenant) {
    tenant.isActive = isActive
  }
}

// Role-based access control helpers
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routePermissions: Record<string, UserRole[]> = {
    "/super-admin": ["super_admin"],
    "/admin": ["admin", "super_admin"],
    "/staff": ["staff", "admin", "super_admin"],
    "/student": ["student"],
    "/parent": ["parent"],
    "/student": ["student"],
  }

  for (const [path, roles] of Object.entries(routePermissions)) {
    if (route.startsWith(path)) {
      return roles.includes(userRole)
    }
  }

  return false
}

// Student management functions
export function getStudentsByTenant(tenantId: string): Student[] {
  return mockStudents.filter((s) => s.tenantId === tenantId)
}

export function addStudent(student: Omit<Student, "id">): Student {
  const newStudent: Student = {
    ...student,
    id: `s${mockStudents.length + 1}`,
  }
  mockStudents.push(newStudent)
  return newStudent
}

export function updateStudent(id: string, updates: Partial<Student>): Student | null {
  const student = mockStudents.find((s) => s.id === id)
  if (student) {
    Object.assign(student, updates)
    // Update status based on payment
    if (student.totalFees - student.paidFees === 0) {
      student.status = "paid"
    } else {
      const dueDate = new Date(student.dueDate)
      const today = new Date()
      if (today > dueDate) {
        student.status = "overdue"
      } else {
        student.status = "pending"
      }
    }
    return student
  }
  return null
}

export function deleteStudent(id: string): boolean {
  const index = mockStudents.findIndex((s) => s.id === id)
  if (index !== -1) {
    mockStudents.splice(index, 1)
    // Also remove related payments
    const paymentIndex = mockPayments.findIndex((p) => p.studentId === id)
    if (paymentIndex !== -1) {
      mockPayments.splice(paymentIndex, 1)
    }
    return true
  }
  return false
}

export function getPaymentsByStudent(studentId: string): Payment[] {
  return mockPayments.filter((p) => p.studentId === studentId)
}

export function addPayment(payment: Omit<Payment, "id">): Payment {
  const newPayment: Payment = {
    ...payment,
    id: `p${mockPayments.length + 1}`,
  }
  mockPayments.push(newPayment)
  
  // Update student's paid fees
  const student = mockStudents.find((s) => s.id === payment.studentId)
  if (student && payment.status === "completed") {
    student.paidFees += payment.amount
    // Update status
    if (student.totalFees - student.paidFees <= 0) {
      student.status = "paid"
    } else {
      const dueDate = new Date(student.dueDate)
      const today = new Date()
      if (today > dueDate) {
        student.status = "overdue"
      } else {
        student.status = "pending"
      }
    }
  }
  
  return newPayment
}

export function getTenantStats(tenantId: string) {
  const students = getStudentsByTenant(tenantId)
  const totalStudents = students.length
  const totalRevenue = students.reduce((sum, s) => sum + s.paidFees, 0)
  const pendingAmount = students.reduce((sum, s) => sum + (s.totalFees - s.paidFees), 0)
  const defaulters = students.filter((s) => s.status === "overdue").length

  return {
    totalStudents,
    totalRevenue,
    pendingAmount,
    defaulters,
  }
}

export function getStudentByUserId(userId: string): Student | null {
  // In a real app, we'd link User.id to Student.id
  // For mock data, we'll match by email
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return null

  const student = mockStudents.find((s) => s.email === user.email)
  return student || null
}

export function getAttendanceByStudent(studentId: string): Attendance[] {
  return mockAttendance.filter((a) => a.studentId === studentId)
}

export function getDefaultersByTenant(tenantId: string): Student[] {
  return mockStudents.filter((s) => s.tenantId === tenantId && s.status === "overdue")
}

// Helper function to normalize phone numbers
function normalizePhone(phone: string): string {
  if (!phone) return ""
  // Remove all spaces and normalize
  let cleaned = phone.trim().replace(/\s+/g, "")
  
  // Handle different formats
  if (cleaned.startsWith("+91")) {
    // Format: +91 9876543210
    return "+91 " + cleaned.substring(3)
  } else if (cleaned.startsWith("91") && cleaned.length === 12) {
    // Format: 919876543210
    return "+91 " + cleaned.substring(2)
  } else if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
    // Format: 9876543210
    return "+91 " + cleaned
  }
  
  // If already has space, normalize it
  if (phone.includes(" ")) {
    const parts = phone.trim().split(/\s+/)
    if (parts[0] === "+91" && parts.length > 1) {
      return "+91 " + parts.slice(1).join("")
    }
  }
  
  // Return as is if format is correct
  return phone.trim()
}

export async function loginStudentByPhoneDOB(phone: string, dateOfBirth: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Normalize phone number and date
  const normalizedPhone = normalizePhone(phone)
  const normalizedDOB = dateOfBirth.trim()

  const student = mockStudents.find((s) => {
    const studentPhone = normalizePhone(s.phone)
    return studentPhone === normalizedPhone && s.dateOfBirth === normalizedDOB
  })
  
  if (student) {
    // Find or create a user account for this student
    let user = mockUsers.find((u) => u.email === student.email && u.role === "student")
    
    if (!user) {
      // Create a user account for the student
      user = {
        id: `u-std-${student.id}`,
        email: student.email,
        name: student.name,
        role: "student",
        tenantId: student.tenantId,
        tenantName: mockTenants.find((t) => t.id === student.tenantId)?.name,
        createdAt: new Date().toISOString(),
      }
      mockUsers.push(user)
    }
    
    return user
  }
  
  return null
}

export async function loginParentByPhone(phone: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Normalize phone number
  const normalizedPhone = normalizePhone(phone)

  const parent = mockParents.find((p) => {
    const parentPhone = normalizePhone(p.phone)
    return parentPhone === normalizedPhone
  })
  
  if (parent) {
    // Find or create a user account for this parent
    let user = mockUsers.find((u) => u.email === parent.email && u.role === "parent")
    
    if (!user) {
      // Create a user account for the parent
      user = {
        id: `u-parent-${parent.id}`,
        email: parent.email,
        name: parent.name,
        role: "parent",
        tenantId: parent.tenantId,
        tenantName: mockTenants.find((t) => t.id === parent.tenantId)?.name,
        createdAt: parent.createdAt,
      }
      mockUsers.push(user)
    }
    
    return user
  }
  
  return null
}

export async function createStaffUser(
  email: string,
  password: string,
  name: string,
  tenantId: string,
  role: "staff" = "staff"
): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if user already exists
  if (mockUsers.find((u) => u.email === email)) {
    throw new Error("User already exists")
  }

  const tenant = mockTenants.find((t) => t.id === tenantId)
  if (!tenant) {
    throw new Error("Invalid tenant")
  }

  const newUser: User = {
    id: `${mockUsers.length + 1}`,
    email,
    name,
    role,
    tenantId,
    tenantName: tenant.name,
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  mockPasswords[email] = password

  return newUser
}

export function getStudentsByBatch(tenantId: string, batch: string): Student[] {
  return mockStudents.filter((s) => s.tenantId === tenantId && s.batch === batch)
}

export function getBatchesByTenant(tenantId: string): string[] {
  const batches = mockStudents
    .filter((s) => s.tenantId === tenantId)
    .map((s) => s.batch)
  return Array.from(new Set(batches)).sort().reverse() // Most recent first
}

export function getStudentsByClass(tenantId: string, className: string): Student[] {
  return mockStudents.filter((s) => s.tenantId === tenantId && s.class === className)
}

export function getClassesByTenant(tenantId: string): string[] {
  const classes = mockStudents
    .filter((s) => s.tenantId === tenantId)
    .map((s) => s.class)
  return Array.from(new Set(classes)).sort()
}

export function getClassStats(tenantId: string, className: string) {
  const classStudents = getStudentsByClass(tenantId, className)
  const totalStudents = classStudents.length
  const totalRevenue = classStudents.reduce((sum, s) => sum + s.paidFees, 0)
  const pendingAmount = classStudents.reduce((sum, s) => sum + (s.totalFees - s.paidFees), 0)
  const defaulters = classStudents.filter((s) => s.status === "overdue").length
  const paid = classStudents.filter((s) => s.status === "paid").length
  const pending = classStudents.filter((s) => s.status === "pending").length

  return {
    className,
    totalStudents,
    totalRevenue,
    pendingAmount,
    defaulters,
    paid,
    pending,
    totalFees: classStudents.reduce((sum, s) => sum + s.totalFees, 0),
  }
}

// Batch management
const mockBatches: Array<{ id: string; name: string; tenantId: string; startDate: string; endDate: string; isActive: boolean }> = [
  { id: "b1", name: "2024-25", tenantId: "t1", startDate: "2024-04-01", endDate: "2025-03-31", isActive: true },
]

export function getAllBatchesByTenant(tenantId: string) {
  return mockBatches.filter((b) => b.tenantId === tenantId)
}

export function addBatch(batch: { name: string; tenantId: string; startDate: string; endDate: string }): any {
  const newBatch = {
    ...batch,
    id: `b${mockBatches.length + 1}`,
    isActive: true,
  }
  mockBatches.push(newBatch)
  return newBatch
}

export function deleteBatch(batchId: string): boolean {
  const index = mockBatches.findIndex((b) => b.id === batchId)
  if (index !== -1) {
    mockBatches.splice(index, 1)
    return true
  }
  return false
}

// Expense Management
export interface Expense {
  id: string
  tenantId: string
  category: string
  description: string
  amount: number
  date: string
  createdBy: string
}

const mockExpenses: Expense[] = [
  {
    id: "e1",
    tenantId: "t1",
    category: "Infrastructure",
    description: "Classroom renovation",
    amount: 50000,
    date: "2025-01-10",
    createdBy: "admin",
  },
  {
    id: "e2",
    tenantId: "t1",
    category: "Staff Salary",
    description: "January staff salaries",
    amount: 200000,
    date: "2025-01-05",
    createdBy: "admin",
  },
]

export function getExpensesByTenant(tenantId: string): Expense[] {
  return mockExpenses.filter((e) => e.tenantId === tenantId)
}

export function addExpense(expense: Omit<Expense, "id">): Expense {
  const newExpense: Expense = {
    ...expense,
    id: `e${mockExpenses.length + 1}`,
  }
  mockExpenses.push(newExpense)
  return newExpense
}

// Refund Management
export interface Refund {
  id: string
  studentId: string
  studentName: string
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected" | "processed"
  requestedDate: string
  processedDate?: string
}

const mockRefunds: Refund[] = [
  {
    id: "r1",
    studentId: "s2",
    studentName: "Jane Smith",
    amount: 5000,
    reason: "Course withdrawal",
    status: "pending",
    requestedDate: "2025-01-20",
  },
]

export function getRefundsByTenant(tenantId: string): Refund[] {
  const tenantStudents = getStudentsByTenant(tenantId).map((s) => s.id)
  return mockRefunds.filter((r) => tenantStudents.includes(r.studentId))
}

export function addRefund(refund: Omit<Refund, "id">): Refund {
  const newRefund: Refund = {
    ...refund,
    id: `r${mockRefunds.length + 1}`,
  }
  mockRefunds.push(newRefund)
  return newRefund
}

export function updateRefundStatus(id: string, status: Refund["status"]): Refund | null {
  const refund = mockRefunds.find((r) => r.id === id)
  if (refund) {
    refund.status = status
    if (status === "processed") {
      refund.processedDate = new Date().toISOString()
    }
    return refund
  }
  return null
}

// Discount/Concession Management
export interface DiscountRequest {
  id: string
  studentId: string
  studentName: string
  discountType: "merit" | "financial" | "sports" | "sibling" | "other"
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected"
  requestedDate: string
  approvedDate?: string
}

const mockDiscountRequests: DiscountRequest[] = [
  {
    id: "d1",
    studentId: "s3",
    studentName: "Bob Wilson",
    discountType: "financial",
    amount: 10000,
    reason: "Financial hardship",
    status: "pending",
    requestedDate: "2025-01-18",
  },
]

export function getDiscountRequestsByTenant(tenantId: string): DiscountRequest[] {
  const tenantStudents = getStudentsByTenant(tenantId).map((s) => s.id)
  return mockDiscountRequests.filter((d) => tenantStudents.includes(d.studentId))
}

export function updateDiscountStatus(id: string, status: DiscountRequest["status"]): DiscountRequest | null {
  const discount = mockDiscountRequests.find((d) => d.id === id)
  if (discount) {
    discount.status = status
    if (status === "approved") {
      discount.approvedDate = new Date().toISOString()
    }
    return discount
  }
  return null
}

// Payment Plans/Installments
export interface PaymentPlan {
  id: string
  studentId: string
  studentName: string
  totalAmount: number
  installments: number
  monthlyAmount: number
  startDate: string
  dueDates: string[]
  paidInstallments: number
  status: "active" | "completed" | "defaulted"
}

const mockPaymentPlans: PaymentPlan[] = [
  {
    id: "pp1",
    studentId: "s2",
    studentName: "Jane Smith",
    totalAmount: 25000,
    installments: 5,
    monthlyAmount: 5000,
    startDate: "2025-01-01",
    dueDates: ["2025-01-01", "2025-02-01", "2025-03-01", "2025-04-01", "2025-05-01"],
    paidInstallments: 1,
    status: "active",
  },
]

export function getPaymentPlansByTenant(tenantId: string): PaymentPlan[] {
  const tenantStudents = getStudentsByTenant(tenantId).map((s) => s.id)
  return mockPaymentPlans.filter((p) => tenantStudents.includes(p.studentId))
}

// Activity Logs
export interface ActivityLog {
  id: string
  tenantId: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string
  timestamp: string
  details?: string
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "l1",
    tenantId: "t1",
    userId: "2",
    userName: "School Admin",
    action: "created",
    entityType: "student",
    entityId: "s1",
    timestamp: new Date().toISOString(),
    details: "Added new student: John Doe",
  },
]

export function getActivityLogsByTenant(tenantId: string): ActivityLog[] {
  return mockActivityLogs.filter((l) => l.tenantId === tenantId).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function addActivityLog(log: Omit<ActivityLog, "id">): ActivityLog {
  const newLog: ActivityLog = {
    ...log,
    id: `l${mockActivityLogs.length + 1}`,
  }
  mockActivityLogs.push(newLog)
  return newLog
}

// Document Management
export interface Document {
  id: string
  studentId: string
  studentName: string
  name: string
  type: "admit_card" | "marksheet" | "certificate" | "id_proof" | "other"
  fileUrl: string
  uploadedDate: string
  uploadedBy: string
  size: number // in bytes
}

const mockDocuments: Document[] = [
  {
    id: "doc1",
    studentId: "s1",
    studentName: "John Doe",
    name: "Class 10 Marksheet",
    type: "marksheet",
    fileUrl: "/documents/s1-marksheet.pdf",
    uploadedDate: "2025-01-15",
    uploadedBy: "admin",
    size: 245760,
  },
  {
    id: "doc2",
    studentId: "s2",
    studentName: "Jane Smith",
    name: "Aadhar Card",
    type: "id_proof",
    fileUrl: "/documents/s2-aadhar.pdf",
    uploadedDate: "2025-01-10",
    uploadedBy: "admin",
    size: 102400,
  },
]

export function getDocumentsByStudent(studentId: string): Document[] {
  return mockDocuments.filter((d) => d.studentId === studentId)
}

export function getDocumentsByTenant(tenantId: string): Document[] {
  const tenantStudents = getStudentsByTenant(tenantId).map((s) => s.id)
  return mockDocuments.filter((d) => tenantStudents.includes(d.studentId))
}

export function addDocument(document: Omit<Document, "id">): Document {
  const newDoc: Document = {
    ...document,
    id: `doc${mockDocuments.length + 1}`,
  }
  mockDocuments.push(newDoc)
  return newDoc
}

// Notifications
export interface Notification {
  id: string
  userId?: string
  tenantId?: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  link?: string
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    tenantId: "t1",
    title: "New Fee Payment Received",
    message: "Jane Smith has paid ₹25,000",
    type: "success",
    read: false,
    createdAt: new Date().toISOString(),
    link: "/admin",
  },
  {
    id: "n2",
    tenantId: "t1",
    title: "Payment Reminder Sent",
    message: "AI reminder sent to 5 students",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "n3",
    userId: "4",
    title: "Fee Payment Due",
    message: "Your fee payment of ₹25,000 is due in 3 days",
    type: "warning",
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    link: "/student",
  },
]

export function getNotificationsByUser(userId: string, tenantId?: string): Notification[] {
  return mockNotifications
    .filter((n) => (n.userId === userId || (n.tenantId === tenantId && !n.userId)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function markNotificationAsRead(notificationId: string): void {
  const notification = mockNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

export function addNotification(notification: Omit<Notification, "id">): Notification {
  const newNotif: Notification = {
    ...notification,
    id: `n${mockNotifications.length + 1}`,
  }
  mockNotifications.push(newNotif)
  return newNotif
}

// Parent Management
export interface Parent {
  id: string
  name: string
  email: string
  phone: string
  studentIds: string[]
  tenantId: string
  createdAt: string
}

const mockParents: Parent[] = [
  {
    id: "p1",
    name: "Rajesh Sharma",
    email: "rajesh@parent.com",
    phone: "+91 9876543210",
    studentIds: ["s1"],
    tenantId: "t1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Priya Patel",
    email: "priya@parent.com",
    phone: "+91 9876543211",
    studentIds: ["s2"],
    tenantId: "t1",
    createdAt: new Date().toISOString(),
  },
]

export function getParentByPhone(phone: string): Parent | null {
  const normalizedPhone = normalizePhone(phone)
  return mockParents.find((p) => normalizePhone(p.phone) === normalizedPhone) || null
}

export function getParentByEmail(email: string): Parent | null {
  return mockParents.find((p) => p.email === email) || null
}

export function getStudentsByParent(parentId: string): Student[] {
  const parent = mockParents.find((p) => p.id === parentId)
  if (!parent) return []
  return mockStudents.filter((s) => parent.studentIds.includes(s.id))
}

export function addParent(parent: Omit<Parent, "id">): Parent {
  const newParent: Parent = {
    ...parent,
    id: `p${mockParents.length + 1}`,
  }
  mockParents.push(newParent)
  return newParent
}

// Student Profile with Photo
export interface StudentProfile extends Student {
  photoUrl?: string
  address?: string
  guardianName?: string
  guardianRelation?: string
  guardianPhone?: string
  emergencyContact?: string
  bloodGroup?: string
  aadharNumber?: string
}

export function updateStudentProfile(studentId: string, updates: Partial<StudentProfile>): StudentProfile | null {
  const student = mockStudents.find((s) => s.id === studentId)
  if (student) {
    Object.assign(student, updates)
    return student as StudentProfile
  }
  return null
}
