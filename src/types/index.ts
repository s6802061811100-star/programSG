export type UserRole = 'ADMIN' | 'REQUESTER' | 'INVENTORY_OFFICER' | 'EXECUTIVE' | 'APPROVER';

export type AppLanguage = 'th' | 'en';

export type SystemMode = 'LIVE' | 'DEMO';

export type RequisitionStatus = 
  | 'DRAFT' 
  | 'PENDING' 
  | 'RETURNED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'RECEIVED' 
  | 'CANCELLED';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  position: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  headName: string;
  budgetAllocated: number;
  budgetUsed: number;
  active: boolean;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  stockQty: number;
  minQty: number;
  unitPrice: number;
  location: string;
  imageUrl?: string;
  description?: string;
  mode: SystemMode;
  updatedAt: string;
}

export interface DurableGood {
  id: string;
  code: string;
  name: string;
  serialNumber: string;
  brandModel: string;
  category: string;
  purchaseDate: string;
  price: number;
  departmentId: string;
  departmentName: string;
  status: 'NORMAL' | 'REPAIR' | 'DISPOSED' | 'LOST';
  location: string;
  mode: SystemMode;
}

export interface Vendor {
  id: string;
  code: string;
  name: string;
  taxId: string;
  contactPerson: string;
  phone: string;
  address: string;
  email?: string;
  active: boolean;
}

export interface BudgetAllocation {
  id: string;
  fiscalYear: string;
  departmentId: string;
  departmentName: string;
  allocatedAmount: number;
  usedAmount: number;
  remainingAmount: number;
  updatedAt: string;
}

export interface RequisitionItem {
  materialId: string;
  materialCode: string;
  materialName: string;
  unit: string;
  unitPrice: number;
  requestedQty: number;
  approvedQty?: number;
  dispatchedQty?: number;
  totalPrice: number;
}

export interface Requisition {
  id: string;
  docNo: string; // e.g. REQ-2569-0001 or TEM-2569-0001
  requesterId: string;
  requesterName: string;
  departmentId: string;
  departmentName: string;
  requesterPosition: string;
  reason: string;
  items: RequisitionItem[];
  totalAmount: number;
  status: RequisitionStatus;
  fiscalYear: string;
  academicYear: string;
  semester: string;
  mode: SystemMode;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
  approvalComment?: string;
  dispatchedAt?: string;
  dispatcherName?: string;
  receivedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetEntity: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  mode: SystemMode;
  ipAddress?: string;
}

export interface SystemSettings {
  systemName: string;
  systemNameEn: string;
  systemShortName: string;
  adminName: string;
  adminEmail: string;
  adminPosition: string;
  fiscalYear: string;
  academicYear: string;
  semester: string;
  systemActive: boolean; // เปิด/ปิดระบบ
  forwardingActive: boolean; // เปิด/ปิดระบบส่งต่อ
  trackingActive: boolean; // เปิด/ปิดระบบติดตาม
  demoModeActive: boolean; // เปิด/ปิดโหมด Demo
  departmentsList: string[]; // List of customizable department names
  googleSpreadsheetId?: string;
  googleWebAppUrl?: string;
  cloudflareProxyUrl?: string;
  cloudflareEnabled?: boolean;
  lastSyncedAt?: string;
}
