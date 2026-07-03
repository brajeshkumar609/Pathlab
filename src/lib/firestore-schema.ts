/**
 * Firestore Database Schemas & Initialization
 * 
 * Defines all collection structures and initialization logic.
 * Ensures strict multi-tenant data isolation by organizationId.
 */

import { db } from '@/config/firebase'
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore'
import type {
  Organization,
  User,
  Patient,
  TestMaster,
  Report,
  Invoice,
  InventoryItem,
  AuditLog,
  Settings,
} from '@/types'

/**
 * Collection References
 */

export const collectionsRef = {
  organizations: collection(db, 'organizations'),
  users: collection(db, 'users'),
  patients: collection(db, 'patients'),
  tests: collection(db, 'tests'),
  reports: collection(db, 'reports'),
  invoices: collection(db, 'invoices'),
  inventory: collection(db, 'inventory'),
  auditLogs: collection(db, 'auditLogs'),
  settings: collection(db, 'settings'),
}

/**
 * Query Builders - Multi-Tenant Safe Queries
 * All queries automatically scope by organizationId
 */

export const queries = {
  /**
   * Get all patients for an organization
   */
  getPatientsByOrg: (organizationId: string) =>
    query(
      collection(db, 'patients'),
      where('organizationId', '==', organizationId),
    ),

  /**
   * Get all tests for an organization
   */
  getTestsByOrg: (organizationId: string) =>
    query(
      collection(db, 'tests'),
      where('organizationId', '==', organizationId),
    ),

  /**
   * Get all reports for an organization
   */
  getReportsByOrg: (organizationId: string) =>
    query(
      collection(db, 'reports'),
      where('organizationId', '==', organizationId),
    ),

  /**
   * Get all invoices for an organization
   */
  getInvoicesByOrg: (organizationId: string) =>
    query(
      collection(db, 'invoices'),
      where('organizationId', '==', organizationId),
    ),

  /**
   * Get all users for an organization
   */
  getUsersByOrg: (organizationId: string) =>
    query(
      collection(db, 'users'),
      where('organizationId', '==', organizationId),
    ),

  /**
   * Get all inventory items for an organization
   */
  getInventoryByOrg: (organizationId: string) =>
    query(
      collection(db, 'inventory'),
      where('organizationId', '==', organizationId),
    ),

  /**
   * Get audit logs for an organization
   */
  getAuditLogsByOrg: (organizationId: string) =>
    query(
      collection(db, 'auditLogs'),
      where('organizationId', '==', organizationId),
    ),

  /**
   * Get organization settings
   */
  getSettingsByOrg: (organizationId: string) =>
    query(
      collection(db, 'settings'),
      where('organizationId', '==', organizationId),
    ),
}

/**
 * Firestore Security Rules
 * 
 * Copy and paste this into Firestore Security Rules tab:
 */

export const FIRESTORE_SECURITY_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users
    function isAuth() {
      return request.auth != null;
    }

    // Check if user belongs to organization
    function userBelongsToOrg(orgId) {
      return isAuth() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId == orgId;
    }

    // Check user role
    function hasRole(orgId, role) {
      return userBelongsToOrg(orgId) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    // Organizations - Creators can read/write their own
    match /organizations/{document=**} {
      allow create: if isAuth();
      allow read, write: if userBelongsToOrg(resource.data.organizationId);
    }

    // Users - Read/write own document or org users if admin
    match /users/{userId} {
      allow create: if isAuth();
      allow read, write: if request.auth.uid == userId || 
                           userBelongsToOrg(resource.data.organizationId);
    }

    // Patients - Only org members can access
    match /patients/{document=**} {
      allow read: if userBelongsToOrg(resource.data.organizationId);
      allow create, write: if userBelongsToOrg(resource.data.organizationId) &&
                              (hasRole(resource.data.organizationId, 'LAB_ADMIN') ||
                               hasRole(resource.data.organizationId, 'RECEPTIONIST'));
    }

    // Tests - Only org members can read, admins can write
    match /tests/{document=**} {
      allow read: if userBelongsToOrg(resource.data.organizationId);
      allow create, write: if userBelongsToOrg(resource.data.organizationId) &&
                              hasRole(resource.data.organizationId, 'LAB_ADMIN');
    }

    // Reports - Lab staff can create/write, all org members can read
    match /reports/{document=**} {
      allow read: if userBelongsToOrg(resource.data.organizationId);
      allow create: if userBelongsToOrg(resource.data.organizationId) &&
                       (hasRole(resource.data.organizationId, 'LAB_TECHNICIAN') ||
                        hasRole(resource.data.organizationId, 'PATHOLOGIST'));
      allow write: if userBelongsToOrg(resource.data.organizationId) &&
                      (hasRole(resource.data.organizationId, 'LAB_ADMIN') ||
                       hasRole(resource.data.organizationId, 'PATHOLOGIST'));
    }

    // Invoices - Admins and receptionists only
    match /invoices/{document=**} {
      allow read: if userBelongsToOrg(resource.data.organizationId);
      allow create, write: if userBelongsToOrg(resource.data.organizationId) &&
                              (hasRole(resource.data.organizationId, 'LAB_ADMIN') ||
                               hasRole(resource.data.organizationId, 'RECEPTIONIST'));
    }

    // Inventory - Lab admin and technician only
    match /inventory/{document=**} {
      allow read: if userBelongsToOrg(resource.data.organizationId);
      allow create, write: if userBelongsToOrg(resource.data.organizationId) &&
                              (hasRole(resource.data.organizationId, 'LAB_ADMIN') ||
                               hasRole(resource.data.organizationId, 'LAB_TECHNICIAN'));
    }

    // AuditLogs - Read-only, auto-written by backend
    match /auditLogs/{document=**} {
      allow read: if userBelongsToOrg(resource.data.organizationId) &&
                     hasRole(resource.data.organizationId, 'LAB_ADMIN');
      allow create: if isAuth(); // Backend writes audit logs
    }

    // Settings - Admins only
    match /settings/{document=**} {
      allow read, write: if userBelongsToOrg(resource.data.organizationId) &&
                           hasRole(resource.data.organizationId, 'LAB_ADMIN');
    }
  }
}
`;
