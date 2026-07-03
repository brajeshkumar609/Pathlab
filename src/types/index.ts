/**
 * Global Application Types
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  LAB_ADMIN = 'LAB_ADMIN',
  DOCTOR = 'DOCTOR',
  PATHOLOGIST = 'PATHOLOGIST',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
}

export interface User {
  id: string
  email: string
  displayName: string
  role: UserRole
  organizationId: string
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastLoginAt?: Date
}

export interface Organization {
  id: string
  name: string
  registrationNumber: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  logo?: string
  licenseExpiresAt: Date
  plan: 'FREE' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  adminId: string
}

export interface Patient {
  id: string
  organizationId: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  email?: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  referringDoctorId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface TestParameter {
  id: string
  name: string
  unit: string
  minRef: number
  maxRef: number
  decimalPlaces: number
  criticalLow?: number
  criticalHigh?: number
  description?: string
}

export interface TestMaster {
  id: string
  organizationId: string
  name: string
  code: string
  category: string
  description?: string
  parameters: TestParameter[]
  sampleType: string
  price: number
  turnaroundTime: number // in hours
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface Report {
  id: string
  organizationId: string
  patientId: string
  testId: string
  barcode: string
  sampleCollectionDate: Date
  receivedDate: Date
  results: Record<string, string | number>
  interpretations?: string
  approvedBy?: string
  approvedAt?: Date
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface Invoice {
  id: string
  organizationId: string
  patientId: string
  invoiceNumber: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED'
  paymentMethod?: 'CASH' | 'CARD' | 'UPI' | 'CHEQUE'
  dueDate: Date
  issuedAt: Date
  paidAt?: Date
  createdBy: string
}

export interface InvoiceItem {
  testId: string
  testName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface InventoryItem {
  id: string
  organizationId: string
  name: string
  code: string
  category: string
  quantity: number
  reorderLevel: number
  unit: string
  supplier?: string
  expiryDate?: Date
  cost: number
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  organizationId: string
  userId: string
  action: string
  entityType: string
  entityId: string
  changes: Record<string, unknown>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

export interface Settings {
  id: string
  organizationId: string
  organizationName: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  reportHeader?: string
  reportFooter?: string
  invoiceTemplate: string
  smsNotifications: boolean
  emailNotifications: boolean
  enableInventory: boolean
  enableAuditLog: boolean
  updatedAt: Date
  updatedBy: string
}
