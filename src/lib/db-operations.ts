/**
 * Database Operations Helper
 * 
 * Safe wrapper functions for database operations.
 * Ensures organizationId is always included.
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Organization, User, Patient, TestMaster, Report, Invoice } from '@/types'

/**
 * Patient Operations
 */
export async function createPatient(
  organizationId: string,
  patientData: Omit<Patient, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
  userId: string,
) {
  const patientRef = doc(collection(db, 'patients'))
  const now = serverTimestamp()

  await setDoc(patientRef, {
    id: patientRef.id,
    organizationId,
    ...patientData,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  })

  return patientRef.id
}

export async function updatePatient(
  organizationId: string,
  patientId: string,
  updates: Partial<Patient>,
) {
  const patientRef = doc(db, 'patients', patientId)
  const patient = await getDoc(patientRef)

  // Verify organization isolation
  if (patient.data()?.organizationId !== organizationId) {
    throw new Error('Unauthorized: Patient does not belong to this organization')
  }

  await updateDoc(patientRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function getPatient(
  organizationId: string,
  patientId: string,
) {
  const patientRef = doc(db, 'patients', patientId)
  const patientDoc = await getDoc(patientRef)

  if (!patientDoc.exists()) {
    return null
  }

  const patient = patientDoc.data() as Patient

  // Verify organization isolation
  if (patient.organizationId !== organizationId) {
    throw new Error('Unauthorized: Patient does not belong to this organization')
  }

  return patient
}

/**
 * Test Master Operations
 */
export async function createTest(
  organizationId: string,
  testData: Omit<TestMaster, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
  userId: string,
) {
  const testRef = doc(collection(db, 'tests'))
  const now = serverTimestamp()

  await setDoc(testRef, {
    id: testRef.id,
    organizationId,
    ...testData,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  })

  return testRef.id
}

export async function getTest(
  organizationId: string,
  testId: string,
) {
  const testRef = doc(db, 'tests', testId)
  const testDoc = await getDoc(testRef)

  if (!testDoc.exists()) {
    return null
  }

  const test = testDoc.data() as TestMaster

  // Verify organization isolation
  if (test.organizationId !== organizationId) {
    throw new Error('Unauthorized: Test does not belong to this organization')
  }

  return test
}

/**
 * Report Operations
 */
export async function createReport(
  organizationId: string,
  reportData: Omit<Report, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>,
  userId: string,
) {
  const reportRef = doc(collection(db, 'reports'))
  const now = serverTimestamp()

  await setDoc(reportRef, {
    id: reportRef.id,
    organizationId,
    ...reportData,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  })

  return reportRef.id
}

export async function updateReportResults(
  organizationId: string,
  reportId: string,
  results: Record<string, string | number>,
  userId: string,
) {
  const reportRef = doc(db, 'reports', reportId)
  const report = await getDoc(reportRef)

  if (!report.exists()) {
    throw new Error('Report not found')
  }

  // Verify organization isolation
  if (report.data()?.organizationId !== organizationId) {
    throw new Error('Unauthorized: Report does not belong to this organization')
  }

  await updateDoc(reportRef, {
    results,
    status: 'IN_PROGRESS',
    updatedAt: serverTimestamp(),
  })
}

export async function approveReport(
  organizationId: string,
  reportId: string,
  userId: string,
) {
  const reportRef = doc(db, 'reports', reportId)
  const report = await getDoc(reportRef)

  if (!report.exists()) {
    throw new Error('Report not found')
  }

  // Verify organization isolation
  if (report.data()?.organizationId !== organizationId) {
    throw new Error('Unauthorized: Report does not belong to this organization')
  }

  await updateDoc(reportRef, {
    status: 'APPROVED',
    approvedBy: userId,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/**
 * Invoice Operations
 */
export async function createInvoice(
  organizationId: string,
  invoiceData: Omit<Invoice, 'id' | 'organizationId' | 'createdAt'>,
  userId: string,
) {
  const invoiceRef = doc(collection(db, 'invoices'))

  await setDoc(invoiceRef, {
    id: invoiceRef.id,
    organizationId,
    ...invoiceData,
    createdBy: userId,
  })

  return invoiceRef.id
}

export async function markInvoiceAsPaid(
  organizationId: string,
  invoiceId: string,
  paymentMethod: string,
) {
  const invoiceRef = doc(db, 'invoices', invoiceId)
  const invoice = await getDoc(invoiceRef)

  if (!invoice.exists()) {
    throw new Error('Invoice not found')
  }

  // Verify organization isolation
  if (invoice.data()?.organizationId !== organizationId) {
    throw new Error('Unauthorized: Invoice does not belong to this organization')
  }

  await updateDoc(invoiceRef, {
    paymentStatus: 'PAID',
    paymentMethod,
    paidAt: serverTimestamp(),
  })
}

/**
 * Audit Log Operations
 */
export async function createAuditLog(
  organizationId: string,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes: Record<string, unknown>,
) {
  const auditRef = doc(collection(db, 'auditLogs'))

  await setDoc(auditRef, {
    id: auditRef.id,
    organizationId,
    userId,
    action,
    entityType,
    entityId,
    changes,
    timestamp: serverTimestamp(),
  })
}
