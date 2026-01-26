// This file contains API wrapper functions that match the original auth.ts function signatures
// but use real API calls instead of mock data

import * as api from './api';

export type UserRole = "super_admin" | "admin" | "staff" | "student" | "parent"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId?: string
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
  dateOfBirth: string
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

export interface Expense {
  id: string
  tenantId: string
  category: string
  description: string
  amount: number
  date: string
  createdBy: string
}

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

export interface Document {
  id: string
  studentId: string
  studentName: string
  name: string
  type: "admit_card" | "marksheet" | "certificate" | "id_proof" | "other"
  fileUrl: string
  uploadedDate: string
  uploadedBy: string
  size: number
}

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

export interface Parent {
  id: string
  name: string
  email: string
  phone: string
  studentIds: string[]
  tenantId: string
  createdAt: string
}

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

// Auth functions
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const response = await api.authAPI.login(email, password);
    return response.user;
  } catch (error) {
    return null;
  }
}

export async function loginStudent(phone: string, dob: string): Promise<User | null> {
  try {
    const response = await api.authAPI.studentLogin(phone, dob);
    return response.user;
  } catch (error) {
    return null;
  }
}

export async function loginStudentByPhoneDOB(phone: string, dateOfBirth: string): Promise<User | null> {
  return loginStudent(phone, dateOfBirth);
}

export async function loginParentByPhone(phone: string): Promise<User | null> {
  try {
    const response = await api.authAPI.parentLogin(phone);
    return response.user;
  } catch (error) {
    return null;
  }
}

export async function login(user: User): Promise<void> {
  // Store user in localStorage
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('feesmart_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      parsed.user = user;
      localStorage.setItem('feesmart_user', JSON.stringify(parsed));
    }
  }
}

export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('feesmart_user');
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  tenantName?: string,
): Promise<User | null> {
  try {
    const response = await api.authAPI.register(email, password, name, role, tenantName);
    return response.user;
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
}

export async function createStaffUser(
  email: string,
  password: string,
  name: string,
  tenantId: string,
  role: "staff" = "staff"
): Promise<User | null> {
  try {
    const response = await api.staffAPI.create({ email, password, name });
    return response;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create staff');
  }
}

// Tenant functions
export async function getTenants(): Promise<Tenant[]> {
  try {
    return await api.tenantsAPI.getAll();
  } catch (error) {
    return [];
  }
}

export async function getUsersByTenant(tenantId: string): Promise<User[]> {
  try {
    // This would need a new API endpoint
    return [];
  } catch (error) {
    return [];
  }
}

export function getAllUsers(): User[] {
  return [];
}

export function updateTenantStatus(tenantId: string, isActive: boolean): void {
  // API call would be made here
  api.tenantsAPI.updateStatus(tenantId, isActive);
}

// Student functions
export async function getStudentsByTenant(tenantId: string): Promise<Student[]> {
  try {
    return await api.studentsAPI.getAll({ tenantId });
  } catch (error) {
    return [];
  }
}

export async function addStudent(student: Omit<Student, "id">): Promise<Student> {
  try {
    return await api.studentsAPI.create(student);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add student');
  }
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
  try {
    return await api.studentsAPI.update(id, updates);
  } catch (error) {
    return null;
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  try {
    await api.studentsAPI.delete(id);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getPaymentsByStudent(studentId: string): Promise<Payment[]> {
  try {
    return await api.paymentsAPI.getByStudent(studentId);
  } catch (error) {
    return [];
  }
}

export async function addPayment(payment: Omit<Payment, "id">): Promise<Payment> {
  try {
    return await api.paymentsAPI.create(payment);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add payment');
  }
}

export async function getTenantStats(tenantId: string) {
  try {
    return await api.statsAPI.getTenantStats();
  } catch (error) {
    return {
      totalStudents: 0,
      totalRevenue: 0,
      pendingAmount: 0,
      defaulters: 0
    };
  }
}

export async function getStudentByUserId(userId: string): Promise<Student | null> {
  try {
    return await api.studentsAPI.getByUserId(userId);
  } catch (error) {
    return null;
  }
}

export async function getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
  try {
    return await api.attendanceAPI.getByStudent(studentId);
  } catch (error) {
    return [];
  }
}

export async function getDefaultersByTenant(tenantId: string): Promise<Student[]> {
  try {
    return await api.studentsAPI.getDefaulters();
  } catch (error) {
    return [];
  }
}

export async function getStudentsByBatch(tenantId: string, batch: string): Promise<Student[]> {
  try {
    return await api.studentsAPI.getAll({ batch });
  } catch (error) {
    return [];
  }
}

export async function getBatchesByTenant(tenantId: string): Promise<string[]> {
  try {
    return await api.studentsAPI.getBatches();
  } catch (error) {
    return [];
  }
}

export async function getStudentsByClass(tenantId: string, className: string): Promise<Student[]> {
  try {
    return await api.studentsAPI.getAll({ class: className });
  } catch (error) {
    return [];
  }
}

export async function getClassesByTenant(tenantId: string): Promise<string[]> {
  try {
    return await api.studentsAPI.getClasses();
  } catch (error) {
    return [];
  }
}

export async function getClassStats(tenantId: string, className: string) {
  try {
    return await api.statsAPI.getClassStats(className);
  } catch (error) {
    return {
      className,
      totalStudents: 0,
      totalRevenue: 0,
      pendingAmount: 0,
      defaulters: 0,
      paid: 0,
      pending: 0,
      totalFees: 0
    };
  }
}

// Batch functions
export async function getAllBatchesByTenant(tenantId: string) {
  try {
    return await api.batchesAPI.getAll();
  } catch (error) {
    return [];
  }
}

export async function addBatch(batch: { name: string; tenantId: string; startDate: string; endDate: string }): Promise<any> {
  try {
    return await api.batchesAPI.create(batch);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add batch');
  }
}

export async function deleteBatch(batchId: string): Promise<boolean> {
  try {
    await api.batchesAPI.delete(batchId);
    return true;
  } catch (error) {
    return false;
  }
}

// Expense functions
export async function getExpensesByTenant(tenantId: string): Promise<Expense[]> {
  try {
    return await api.expensesAPI.getAll();
  } catch (error) {
    return [];
  }
}

export async function addExpense(expense: Omit<Expense, "id">): Promise<Expense> {
  try {
    return await api.expensesAPI.create(expense);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add expense');
  }
}

// Refund functions
export async function getRefundsByTenant(tenantId: string): Promise<Refund[]> {
  try {
    return await api.refundsAPI.getAll();
  } catch (error) {
    return [];
  }
}

export function addRefund(refund: Omit<Refund, "id">): Refund {
  // This would need to be async, but keeping signature for compatibility
  throw new Error('Use async version');
}

export async function updateRefundStatus(id: string, status: Refund["status"]): Promise<Refund | null> {
  try {
    return await api.refundsAPI.updateStatus(id, status);
  } catch (error) {
    return null;
  }
}

// Discount functions
export async function getDiscountRequestsByTenant(tenantId: string): Promise<DiscountRequest[]> {
  try {
    return await api.discountsAPI.getAll();
  } catch (error) {
    return [];
  }
}

export async function updateDiscountStatus(id: string, status: DiscountRequest["status"]): Promise<DiscountRequest | null> {
  try {
    return await api.discountsAPI.updateStatus(id, status);
  } catch (error) {
    return null;
  }
}

// Payment Plan functions
export async function getPaymentPlansByTenant(tenantId: string): Promise<PaymentPlan[]> {
  try {
    return await api.paymentPlansAPI.getAll();
  } catch (error) {
    return [];
  }
}

// Activity Log functions
export async function getActivityLogsByTenant(tenantId: string): Promise<ActivityLog[]> {
  try {
    return await api.activityLogsAPI.getAll();
  } catch (error) {
    return [];
  }
}

export function addActivityLog(log: Omit<ActivityLog, "id">): ActivityLog {
  throw new Error('Use async version');
}

// Document functions
export async function getDocumentsByStudent(studentId: string): Promise<Document[]> {
  try {
    return await api.documentsAPI.getByStudent(studentId);
  } catch (error) {
    return [];
  }
}

export async function getDocumentsByTenant(tenantId: string): Promise<Document[]> {
  try {
    return await api.documentsAPI.getAll();
  } catch (error) {
    return [];
  }
}

export async function addDocument(document: Omit<Document, "id">): Promise<Document> {
  try {
    return await api.documentsAPI.create(document);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add document');
  }
}

// Notification functions
export async function getNotificationsByUser(userId: string, tenantId?: string): Promise<Notification[]> {
  try {
    return await api.notificationsAPI.getAll();
  } catch (error) {
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await api.notificationsAPI.markAsRead(notificationId);
  } catch (error) {
    // Ignore errors
  }
}

export function addNotification(notification: Omit<Notification, "id">): Notification {
  throw new Error('Use async version');
}

// Parent functions
export async function getParentByPhone(phone: string): Promise<Parent | null> {
  try {
    // This would need a new API endpoint
    return null;
  } catch (error) {
    return null;
  }
}

export async function getParentByEmail(email: string): Promise<Parent | null> {
  try {
    return await api.parentsAPI.getByEmail(email);
  } catch (error) {
    return null;
  }
}

export async function getStudentsByParent(parentId: string): Promise<Student[]> {
  try {
    return await api.parentsAPI.getStudents(parentId);
  } catch (error) {
    return [];
  }
}

export async function addParent(parent: Omit<Parent, "id">): Promise<Parent> {
  try {
    return await api.parentsAPI.create(parent);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add parent');
  }
}

// Student Profile functions
export async function updateStudentProfile(studentId: string, updates: Partial<StudentProfile>): Promise<StudentProfile | null> {
  try {
    return await api.studentsAPI.update(studentId, updates) as StudentProfile | null;
  } catch (error) {
    return null;
  }
}

// Role-based access control
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routePermissions: Record<string, UserRole[]> = {
    "/super-admin": ["super_admin"],
    "/admin": ["admin", "super_admin"],
    "/staff": ["staff", "admin", "super_admin"],
    "/student": ["student"],
    "/parent": ["parent"],
  };

  for (const [path, roles] of Object.entries(routePermissions)) {
    if (route.startsWith(path)) {
      return roles.includes(userRole);
    }
  }

  return false;
}

