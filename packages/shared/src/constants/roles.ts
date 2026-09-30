import { UserRole } from '../types/index';

export interface PermissionDefinition {
  manageUsers: boolean;
  editCMS: boolean;
  manageStudents: boolean;
  manageFees: boolean;
  collectFees: boolean;
  manageAdmissions: boolean;
  viewPrincipalDashboard: boolean;
  accessPlatformOwner: boolean;
  deleteRecords: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionDefinition> = {
  platform_owner: {
    manageUsers: true,
    editCMS: true,
    manageStudents: true,
    manageFees: true,
    collectFees: true,
    manageAdmissions: true,
    viewPrincipalDashboard: true,
    accessPlatformOwner: true,
    deleteRecords: true
  },
  school_super_admin: {
    manageUsers: true,
    editCMS: true,
    manageStudents: true,
    manageFees: true,
    collectFees: true,
    manageAdmissions: true,
    viewPrincipalDashboard: true,
    accessPlatformOwner: false,
    deleteRecords: true
  },
  school_admin: {
    manageUsers: false,
    editCMS: true,
    manageStudents: true,
    manageFees: true,
    collectFees: true,
    manageAdmissions: true,
    viewPrincipalDashboard: false,
    accessPlatformOwner: false,
    deleteRecords: true
  },
  data_entry_operator: {
    manageUsers: false,
    editCMS: true,
    manageStudents: true,
    manageFees: false,
    collectFees: false,
    manageAdmissions: true,
    viewPrincipalDashboard: false,
    accessPlatformOwner: false,
    deleteRecords: false
  },
  accountant: {
    manageUsers: false,
    editCMS: false,
    manageStudents: false,
    manageFees: true,
    collectFees: true,
    manageAdmissions: false,
    viewPrincipalDashboard: false,
    accessPlatformOwner: false,
    deleteRecords: false
  },
  teacher: {
    manageUsers: false,
    editCMS: false,
    manageStudents: false,
    manageFees: false,
    collectFees: false,
    manageAdmissions: false,
    viewPrincipalDashboard: false,
    accessPlatformOwner: false,
    deleteRecords: false
  },
  parent: {
    manageUsers: false,
    editCMS: false,
    manageStudents: false,
    manageFees: false,
    collectFees: true,
    manageAdmissions: false,
    viewPrincipalDashboard: false,
    accessPlatformOwner: false,
    deleteRecords: false
  },
  student: {
    manageUsers: false,
    editCMS: false,
    manageStudents: false,
    manageFees: false,
    collectFees: false,
    manageAdmissions: false,
    viewPrincipalDashboard: false,
    accessPlatformOwner: false,
    deleteRecords: false
  }
};
