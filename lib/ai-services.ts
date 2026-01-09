import type { Student } from "./auth"

export interface AIInsight {
  type: "prediction" | "reminder" | "alert"
  message: string
  priority: "high" | "medium" | "low"
  studentId?: string
  predictedAmount?: number
}

export interface ReminderSchedule {
  studentId: string
  studentName: string
  scheduledDate: string
  message: string
  channel: "whatsapp" | "sms" | "email"
  status: "scheduled" | "sent" | "failed"
}

// Mock AI prediction service
export async function predictMonthlyRevenue(tenantId: string, students: Student[]): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple algorithm: sum of paid fees + (50% of pending fees with status not overdue)
  const currentRevenue = students.reduce((sum, s) => sum + s.paidFees, 0)
  const predictablePending = students
    .filter((s) => s.status !== "overdue")
    .reduce((sum, s) => sum + (s.totalFees - s.paidFees) * 0.5, 0)

  return currentRevenue + predictablePending
}

// AI-powered insights generator
export async function generateInsights(students: Student[]): Promise<AIInsight[]> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const insights: AIInsight[] = []

  // Identify high-risk defaulters
  const overdueStudents = students.filter((s) => s.status === "overdue")
  if (overdueStudents.length > 0) {
    insights.push({
      type: "alert",
      message: `${overdueStudents.length} students have overdue payments. Immediate action recommended.`,
      priority: "high",
    })
  }

  // Identify students with large pending amounts
  const highPendingStudents = students.filter((s) => {
    const pending = s.totalFees - s.paidFees
    return pending > 20000 && s.status !== "paid"
  })

  if (highPendingStudents.length > 0) {
    insights.push({
      type: "reminder",
      message: `${highPendingStudents.length} students have pending amounts over ₹20,000. Consider sending personalized reminders.`,
      priority: "medium",
    })
  }

  // Predict payment likelihood
  const upcomingDue = students.filter((s) => {
    const dueDate = new Date(s.dueDate)
    const today = new Date()
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0 && s.status === "pending"
  })

  if (upcomingDue.length > 0) {
    insights.push({
      type: "reminder",
      message: `${upcomingDue.length} students have dues within 7 days. Send automated reminders now.`,
      priority: "high",
    })
  }

  return insights
}

// AI-optimized reminder scheduling
export function generateOptimalReminderSchedule(students: Student[]): ReminderSchedule[] {
  const schedules: ReminderSchedule[] = []

  students.forEach((student) => {
    if (student.status === "paid") return

    const dueDate = new Date(student.dueDate)
    const today = new Date()
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Schedule reminders based on AI-optimized timing
    if (student.status === "overdue") {
      // Immediate reminder for overdue
      schedules.push({
        studentId: student.id,
        studentName: student.name,
        scheduledDate: new Date().toISOString(),
        message: `URGENT: Your fee payment of ₹${(student.totalFees - student.paidFees).toLocaleString()} is overdue. Please pay immediately to avoid penalties.`,
        channel: "whatsapp",
        status: "scheduled",
      })
    } else if (diffDays <= 3 && diffDays > 0) {
      // 3 days before due date
      schedules.push({
        studentId: student.id,
        studentName: student.name,
        scheduledDate: new Date().toISOString(),
        message: `Reminder: Your fee payment of ₹${(student.totalFees - student.paidFees).toLocaleString()} is due in ${diffDays} days.`,
        channel: "sms",
        status: "scheduled",
      })
    } else if (diffDays <= 7 && diffDays > 3) {
      // 7 days before due date
      const scheduledDate = new Date()
      scheduledDate.setDate(scheduledDate.getDate() + (diffDays - 3))
      schedules.push({
        studentId: student.id,
        studentName: student.name,
        scheduledDate: scheduledDate.toISOString(),
        message: `Friendly reminder: Your fee payment of ₹${(student.totalFees - student.paidFees).toLocaleString()} is due on ${dueDate.toLocaleDateString()}.`,
        channel: "email",
        status: "scheduled",
      })
    }
  })

  return schedules
}

// Natural language query processing for reports
export async function processNLQuery(query: string, students: Student[]): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const lowerQuery = query.toLowerCase()

  // Total collection
  if (lowerQuery.includes("total") && (lowerQuery.includes("collection") || lowerQuery.includes("revenue"))) {
    const total = students.reduce((sum, s) => sum + s.paidFees, 0)
    return `Total collection: ₹${total.toLocaleString()}`
  }

  // Pending amount
  if (lowerQuery.includes("pending") || lowerQuery.includes("due")) {
    const pending = students.reduce((sum, s) => sum + (s.totalFees - s.paidFees), 0)
    return `Total pending amount: ₹${pending.toLocaleString()}`
  }

  // Defaulters
  if (lowerQuery.includes("defaulter") || lowerQuery.includes("overdue")) {
    const defaulters = students.filter((s) => s.status === "overdue")
    return `Total defaulters: ${defaulters.length}. Names: ${defaulters.map((s) => s.name).join(", ")}`
  }

  // Class-wise report
  if (lowerQuery.includes("class")) {
    const classMatch = lowerQuery.match(/class\s+(\w+)/i)
    if (classMatch) {
      const className = classMatch[0]
      const classStudents = students.filter((s) => s.class.toLowerCase().includes(className.toLowerCase()))
      const collected = classStudents.reduce((sum, s) => sum + s.paidFees, 0)
      return `${classMatch[0]}: ${classStudents.length} students, ₹${collected.toLocaleString()} collected`
    }
  }

  return "I can help you with queries like: 'total collection', 'pending amount', 'show defaulters', 'class 10 report'"
}

// AI Chatbot support
export async function processChatQuery(query: string, context: { role: string; name: string }): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const q = query.toLowerCase()

  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return `Hello ${context.name}! I'm your FeeSmart AI assistant. I can help you with ${context.role === "student" ? "fee status, receipts, and payment extensions" : "collection reports, student defaulters, and reminder scheduling"}. How can I assist you today?`
  }

  // Role-specific responses for Students
  if (context.role === "student") {
    if (q.includes("extension") || q.includes("extra time") || q.includes("delay")) {
      return "I can help you request a payment extension. Please navigate to the 'Requests & Extension' tab in your dashboard and select 'Request Payment Extension' to submit your case for review."
    }
    if (q.includes("scholarship") || q.includes("discount")) {
      return "Scholarship applications are open for this academic year. You can apply directly through the 'Documents' section or by clicking 'Apply for Scholarship' in the Requests tab."
    }
    if (q.includes("overdue") || q.includes("late")) {
      return "It looks like you have some pending dues. To avoid late fees, I recommend processing the payment today via UPI or Card in your 'My Fee Dashboard'."
    }
  }

  // Role-specific responses for Admin/Super Admin
  if (context.role === "admin" || context.role === "super_admin") {
    if (q.includes("collection") || q.includes("revenue") || q.includes("money")) {
      return "The collection trend is looking positive this month. Would you like me to generate a detailed revenue prediction report or show you the top-performing batches?"
    }
    if (q.includes("defaulter") || q.includes("not paid") || q.includes("pending list")) {
      return "I've identified 3 high-risk defaulters. I recommend triggering the 'AI-Optimized Reminder Schedule' from your dashboard to send personalized WhatsApp alerts."
    }
    if (q.includes("new student") || q.includes("add student")) {
      return "You can add a new student by clicking the 'Add Student' button at the top of your dashboard. Don't forget to assign them a batch and fee head structure."
    }
  }

  if (q.includes("pay") || q.includes("fee")) {
    if (context.role === "student") {
      return "You can view and pay your fees in the 'My Fee Dashboard'. We support UPI (PhonePe, GPay), Cards, and Net Banking with instant receipt generation."
    }
    return "Admins can record offline payments or track online collections in real-time from the 'Students' tab."
  }

  if (q.includes("receipt") || q.includes("download") || q.includes("invoice")) {
    return "Digital receipts are available for download in the 'Payment History' section. Every receipt is AI-verified and includes a unique QR code for verification."
  }

  if (q.includes("reminder") || q.includes("whatsapp") || q.includes("sms")) {
    return "Our system uses AI to analyze student behavior and sends reminders at the most optimal time. For admins, these can be managed in the 'AI Reminders' tab."
  }

  return "I'm here to help with FeeSmart features. You can ask me about fee status, collection reports, receipt downloads, or how to manage students and batches."
}
