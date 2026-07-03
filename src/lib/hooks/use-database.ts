/**
 * Hook: useDatabase
 * 
 * Provides database operations scoped to current organization.
 */

'use client'

import { useCallback } from 'react'
import { useAuth } from './auth-context'
import { useOrganization } from './organization-context'
import * as dbOps from './db-operations'

export function useDatabase() {
  const { user } = useAuth()
  const { organizationId } = useOrganization()

  if (!user || !organizationId) {
    throw new Error('useDatabase must be used with authenticated user in organization')
  }

  // Wrap all database operations to include organizationId
  const wrappedOps = {
    createPatient: useCallback(
      (patientData: Parameters<typeof dbOps.createPatient>[1]) =>
        dbOps.createPatient(organizationId, patientData, user.uid),
      [organizationId, user.uid],
    ),

    updatePatient: useCallback(
      (patientId: string, updates: Parameters<typeof dbOps.updatePatient>[2]) =>
        dbOps.updatePatient(organizationId, patientId, updates),
      [organizationId],
    ),

    getPatient: useCallback(
      (patientId: string) => dbOps.getPatient(organizationId, patientId),
      [organizationId],
    ),

    createTest: useCallback(
      (testData: Parameters<typeof dbOps.createTest>[1]) =>
        dbOps.createTest(organizationId, testData, user.uid),
      [organizationId, user.uid],
    ),

    getTest: useCallback(
      (testId: string) => dbOps.getTest(organizationId, testId),
      [organizationId],
    ),

    createReport: useCallback(
      (reportData: Parameters<typeof dbOps.createReport>[1]) =>
        dbOps.createReport(organizationId, reportData, user.uid),
      [organizationId, user.uid],
    ),

    updateReportResults: useCallback(
      (reportId: string, results: Record<string, string | number>) =>
        dbOps.updateReportResults(organizationId, reportId, results, user.uid),
      [organizationId, user.uid],
    ),

    approveReport: useCallback(
      (reportId: string) => dbOps.approveReport(organizationId, reportId, user.uid),
      [organizationId, user.uid],
    ),

    createInvoice: useCallback(
      (invoiceData: Parameters<typeof dbOps.createInvoice>[1]) =>
        dbOps.createInvoice(organizationId, invoiceData, user.uid),
      [organizationId, user.uid],
    ),

    markInvoiceAsPaid: useCallback(
      (invoiceId: string, paymentMethod: string) =>
        dbOps.markInvoiceAsPaid(organizationId, invoiceId, paymentMethod),
      [organizationId],
    ),

    createAuditLog: useCallback(
      (
        action: string,
        entityType: string,
        entityId: string,
        changes: Record<string, unknown>,
      ) =>
        dbOps.createAuditLog(organizationId, user.uid, action, entityType, entityId, changes),
      [organizationId, user.uid],
    ),
  }

  return wrappedOps
}
