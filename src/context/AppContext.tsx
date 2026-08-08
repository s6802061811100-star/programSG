import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, AppLanguage, SystemMode, SystemSettings, 
  Department, Material, DurableGood, Vendor, BudgetAllocation, 
  Requisition, AuditLog, RequisitionStatus 
} from '../types';
import { 
  initialSettings, initialUsers, initialDepartments, 
  initialMaterialsLive, initialMaterialsDemo, initialDurableGoods, 
  initialVendors, initialBudgets, initialRequisitionsLive, 
  initialRequisitionsDemo, initialAuditLogs 
} from '../services/mockData';
import { syncStateToGoogleSheets, generateGoogleAppsScriptCode } from '../services/googleSheets';

interface ConfirmDialogConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  user: User;
  language: AppLanguage;
  mode: SystemMode;
  settings: SystemSettings;
  users: User[];
  departments: Department[];
  materials: Material[]; // Returns live or demo materials based on current mode
  materialsLive: Material[];
  materialsDemo: Material[];
  durableGoods: DurableGood[];
  vendors: Vendor[];
  budgets: BudgetAllocation[];
  requisitions: Requisition[]; // Returns live or demo requisitions based on current mode
  requisitionsLive: Requisition[];
  requisitionsDemo: Requisition[];
  auditLogs: AuditLog[];
  confirmDialog: ConfirmDialogConfig;
  isSyncing: boolean;
  lastSyncMessage: string;

  // Actions
  switchLanguage: (lang: AppLanguage) => void;
  switchRole: (role: UserRole) => void;
  toggleDemoMode: (active: boolean) => void;
  generateDemoData: () => void;
  purgeDemoData: () => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Department
  addDepartment: (dept: Omit<Department, 'id' | 'budgetUsed'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // User Management
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Materials
  addMaterial: (item: Omit<Material, 'id' | 'updatedAt' | 'mode'>) => void;
  updateMaterial: (id: string, item: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  adjustStock: (materialId: string, newStockQty: number, reason: string) => void;

  // Durable Goods
  addDurableGood: (item: Omit<DurableGood, 'id' | 'mode'>) => void;
  updateDurableGood: (id: string, item: Partial<DurableGood>) => void;
  deleteDurableGood: (id: string) => void;

  // Vendors
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // Budget
  addBudgetAllocation: (budget: Omit<BudgetAllocation, 'id' | 'updatedAt'>) => void;
  updateBudgetAllocation: (id: string, budget: Partial<BudgetAllocation>) => void;

  // Requisitions
  createRequisition: (data: Omit<Requisition, 'id' | 'docNo' | 'status' | 'createdAt' | 'updatedAt' | 'mode' | 'updatedBy'>, isDraft?: boolean) => void;
  updateRequisition: (id: string, data: Partial<Requisition>) => void;
  cancelRequisition: (id: string, comment?: string) => void;
  approveRequisition: (id: string, comment: string, itemsApprovedQty?: Record<string, number>) => void;
  rejectRequisition: (id: string, comment: string) => void;
  sendBackRequisition: (id: string, comment: string) => void;
  receiveRequisition: (id: string) => void;

  // Audit Log & Utilities
  addAuditLog: (action: string, targetEntity: string, details: string, oldValue?: string, newValue?: string) => void;
  showConfirmDialog: (config: Omit<ConfirmDialogConfig, 'isOpen'>) => void;
  hideConfirmDialog: () => void;
  triggerSheetsSync: () => void;
  getAppsScriptCode: () => string;
}

const STORAGE_PREFIX = 'SATIT_INV_APP_DATA_V1';

const loadStoredData = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading stored key ${key}`, e);
  }
  return fallback;
};

const saveStoredData = (key: string, data: any) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving stored key ${key}`, e);
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>('th');
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = loadStoredData('settings', initialSettings);
    return {
      ...initialSettings,
      ...saved,
      googleSpreadsheetId: saved.googleSpreadsheetId || initialSettings.googleSpreadsheetId,
      googleWebAppUrl: saved.googleWebAppUrl || initialSettings.googleWebAppUrl,
    };
  });
  const [mode, setMode] = useState<SystemMode>(() => (loadStoredData('settings', initialSettings).demoModeActive ? 'DEMO' : 'LIVE'));
  const [users, setUsers] = useState<User[]>(() => loadStoredData('users', initialUsers));
  
  // Current user logged in (default to Admin)
  const [user, setUser] = useState<User>(() => users[0] || initialUsers[0]);

  const [departments, setDepartments] = useState<Department[]>(() => loadStoredData('departments', initialDepartments));
  const [materialsLive, setMaterialsLive] = useState<Material[]>(() => loadStoredData('materialsLive', initialMaterialsLive));
  const [materialsDemo, setMaterialsDemo] = useState<Material[]>(() => loadStoredData('materialsDemo', initialMaterialsDemo));
  const [durableGoods, setDurableGoods] = useState<DurableGood[]>(() => loadStoredData('durableGoods', initialDurableGoods));
  const [vendors, setVendors] = useState<Vendor[]>(() => loadStoredData('vendors', initialVendors));
  const [budgets, setBudgets] = useState<BudgetAllocation[]>(() => loadStoredData('budgets', initialBudgets));
  const [requisitionsLive, setRequisitionsLive] = useState<Requisition[]>(() => loadStoredData('requisitionsLive', initialRequisitionsLive));
  const [requisitionsDemo, setRequisitionsDemo] = useState<Requisition[]>(() => loadStoredData('requisitionsDemo', initialRequisitionsDemo));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStoredData('auditLogs', initialAuditLogs));

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncMessage, setLastSyncMessage] = useState<string>('');

  // Persist to localStorage whenever state updates
  useEffect(() => {
    saveStoredData('settings', settings);
    saveStoredData('users', users);
    saveStoredData('departments', departments);
    saveStoredData('materialsLive', materialsLive);
    saveStoredData('materialsDemo', materialsDemo);
    saveStoredData('durableGoods', durableGoods);
    saveStoredData('vendors', vendors);
    saveStoredData('budgets', budgets);
    saveStoredData('requisitionsLive', requisitionsLive);
    saveStoredData('requisitionsDemo', requisitionsDemo);
    saveStoredData('auditLogs', auditLogs);
  }, [settings, users, departments, materialsLive, materialsDemo, durableGoods, vendors, budgets, requisitionsLive, requisitionsDemo, auditLogs]);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const showConfirmDialog = (config: Omit<ConfirmDialogConfig, 'isOpen'>) => {
    setConfirmDialog({ ...config, isOpen: true });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Switch Language
  const switchLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
  };

  // Switch Role / User (Quick switcher for testing and demoing)
  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setUser(targetUser);
      addAuditLogDirect('สลับบทบาทการทำงาน (SWITCH_ROLE)', `ผู้ใช้ ${targetUser.name}`, `สลับเป็นบทบาท ${role}`);
    }
  };

  // Direct helper for audit log without state closure issues
  const addAuditLogDirect = (action: string, targetEntity: string, details: string, oldValue?: string, newValue?: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      targetEntity,
      details,
      oldValue,
      newValue,
      mode
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addAuditLog = (action: string, targetEntity: string, details: string, oldValue?: string, newValue?: string) => {
    addAuditLogDirect(action, targetEntity, details, oldValue, newValue);
  };

  // Toggle Demo Mode (ADMIN only)
  const toggleDemoMode = (active: boolean) => {
    const newMode: SystemMode = active ? 'DEMO' : 'LIVE';
    setMode(newMode);
    setSettings(prev => ({ ...prev, demoModeActive: active }));
    addAuditLogDirect('สลับโหมดระบบ (TOGGLE_DEMO_MODE)', `โหมดระบบ ${newMode}`, `ตั้งค่า Demo Mode = ${active}`);
    triggerSheetsSync();
  };

  // Generate Demo Data
  const generateDemoData = () => {
    setMaterialsDemo(initialMaterialsDemo);
    setRequisitionsDemo(initialRequisitionsDemo);
    addAuditLogDirect('สร้างข้อมูลทดลอง (GENERATE_DEMO_DATA)', 'ชุดข้อมูล Demo', 'สร้างข้อมูลวัสดุและคำขอเบิกตัวอย่างในโหมด DEMO');
    triggerSheetsSync();
  };

  // Purge Demo Data (Strict Rule #11 & Rule #12)
  const purgeDemoData = () => {
    setMaterialsDemo([]);
    setRequisitionsDemo([]);
    addAuditLogDirect('ล้างข้อมูลทดลอง (PURGE_DEMO_DATA)', 'ชุดข้อมูล Demo', 'ลบข้อมูลวัสดุและคำขอเบิกทั้งหมดในโหมด DEMO');
    triggerSheetsSync();
  };

  // Update Settings
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const updated = { ...settings, ...newSettings, lastSyncedAt: new Date().toISOString() };
    setSettings(updated);
    addAuditLogDirect('อัปเดตตั้งค่าระบบ (UPDATE_SETTINGS)', 'การตั้งค่าระบบ', `แก้ไขการตั้งค่าระบบโดย ${user.name}`);
    triggerSheetsSync();
  };

  // Trigger Google Sheets Sync
  const triggerSheetsSync = async () => {
    setIsSyncing(true);
    const result = await syncStateToGoogleSheets(
      settings.googleWebAppUrl || '',
      {
        settings,
        users,
        departments,
        materialsLive,
        materialsDemo,
        durableGoods,
        vendors,
        budgets,
        requisitionsLive,
        requisitionsDemo,
        auditLogs
      }
    );
    setIsSyncing(false);
    setLastSyncMessage(result.message);
  };

  // Department Management
  const addDepartment = (dept: Omit<Department, 'id' | 'budgetUsed'>) => {
    const newDept: Department = {
      ...dept,
      id: `DEP-00${departments.length + 1}`,
      budgetUsed: 0
    };
    setDepartments(prev => [...prev, newDept]);
    addAuditLogDirect('เพิ่มหน่วยงาน (ADD_DEPARTMENT)', `หน่วยงาน ${dept.name}`, `เพิ่มหน่วยงานรหัส ${dept.code}`);
    triggerSheetsSync();
  };

  const updateDepartment = (id: string, dept: Partial<Department>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...dept } : d));
    addAuditLogDirect('แก้ไขหน่วยงาน (UPDATE_DEPARTMENT)', `หน่วยงาน ID ${id}`, `แก้ไขข้อมูลหน่วยงาน`);
    triggerSheetsSync();
  };

  const deleteDepartment = (id: string) => {
    const target = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(d => d.id !== id));
    addAuditLogDirect('ลบหน่วยงาน (DELETE_DEPARTMENT)', `หน่วยงาน ${target?.name || id}`, `ลบหน่วยงานออกจากระบบ`);
    triggerSheetsSync();
  };

  // User Management
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `USR-00${users.length + 1}`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLogDirect('เพิ่มผู้ใช้งาน (ADD_USER)', `ผู้ใช้งาน ${userData.name}`, `สร้างบัญชีผู้ใช้ ${userData.username} สิทธิ์ ${userData.role}`);
    triggerSheetsSync();
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
    addAuditLogDirect('แก้ไขผู้ใช้งาน (UPDATE_USER)', `ผู้ใช้งาน ID ${id}`, `แก้ไขข้อมูลผู้ใช้`);
    triggerSheetsSync();
  };

  const deleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLogDirect('ลบผู้ใช้งาน (DELETE_USER)', `ผู้ใช้งาน ${target?.name || id}`, `ลบบัญชีผู้ใช้`);
    triggerSheetsSync();
  };

  // Materials Management
  const addMaterial = (itemData: Omit<Material, 'id' | 'updatedAt' | 'mode'>) => {
    const isDemo = mode === 'DEMO';
    const newId = `${isDemo ? 'DEMO-' : ''}MAT-${Date.now().toString().slice(-4)}`;
    const newItem: Material = {
      ...itemData,
      id: newId,
      mode,
      updatedAt: new Date().toISOString()
    };

    if (isDemo) {
      setMaterialsDemo(prev => [...prev, newItem]);
    } else {
      setMaterialsLive(prev => [...prev, newItem]);
    }
    addAuditLogDirect('เพิ่มรายการพัสดุ (ADD_MATERIAL)', `พัสดุ ${itemData.name}`, `รหัส ${itemData.code} จำนวน ${itemData.stockQty} ${itemData.unit} (${mode})`);
    triggerSheetsSync();
  };

  const updateMaterial = (id: string, itemData: Partial<Material>) => {
    const isDemo = mode === 'DEMO';
    const updater = (prev: Material[]) => prev.map(m => m.id === id ? { ...m, ...itemData, updatedAt: new Date().toISOString() } : m);
    if (isDemo) {
      setMaterialsDemo(updater);
    } else {
      setMaterialsLive(updater);
    }
    addAuditLogDirect('แก้ไขรายการพัสดุ (UPDATE_MATERIAL)', `พัสดุ ID ${id}`, `อัปเดตข้อมูลพัสดุ (${mode})`);
    triggerSheetsSync();
  };

  const deleteMaterial = (id: string) => {
    const isDemo = mode === 'DEMO';
    if (isDemo) {
      setMaterialsDemo(prev => prev.filter(m => m.id !== id));
    } else {
      setMaterialsLive(prev => prev.filter(m => m.id !== id));
    }
    addAuditLogDirect('ลบรายการพัสดุ (DELETE_MATERIAL)', `พัสดุ ID ${id}`, `ลบรายการพัสดุออกจากคลัง (${mode})`);
    triggerSheetsSync();
  };

  const adjustStock = (materialId: string, newStockQty: number, reason: string) => {
    const isDemo = mode === 'DEMO';
    const matList = isDemo ? materialsDemo : materialsLive;
    const target = matList.find(m => m.id === materialId);
    if (!target) return;

    const oldQty = target.stockQty;
    const updater = (prev: Material[]) => prev.map(m => m.id === materialId ? { ...m, stockQty: newStockQty, updatedAt: new Date().toISOString() } : m);

    if (isDemo) {
      setMaterialsDemo(updater);
    } else {
      setMaterialsLive(updater);
    }

    addAuditLogDirect(
      'ปรับยอดพัสดุคงคลัง (ADJUST_STOCK)', 
      `พัสดุ ${target.name}`, 
      `ปรับยอดจาก ${oldQty} เป็น ${newStockQty} ${target.unit}. เหตุผล: ${reason}`,
      String(oldQty),
      String(newStockQty)
    );
    triggerSheetsSync();
  };

  // Durable Goods
  const addDurableGood = (itemData: Omit<DurableGood, 'id' | 'mode'>) => {
    const newGood: DurableGood = {
      ...itemData,
      id: `DUR-${Date.now().toString().slice(-4)}`,
      mode
    };
    setDurableGoods(prev => [...prev, newGood]);
    addAuditLogDirect('เพิ่มครุภัณฑ์ (ADD_DURABLE_GOOD)', `ครุภัณฑ์ ${itemData.name}`, `รหัส ${itemData.code} เลขซีเรียล ${itemData.serialNumber}`);
    triggerSheetsSync();
  };

  const updateDurableGood = (id: string, itemData: Partial<DurableGood>) => {
    setDurableGoods(prev => prev.map(g => g.id === id ? { ...g, ...itemData } : g));
    addAuditLogDirect('แก้ไขครุภัณฑ์ (UPDATE_DURABLE_GOOD)', `ครุภัณฑ์ ID ${id}`, `อัปเดตสถานะ/ข้อมูลครุภัณฑ์`);
    triggerSheetsSync();
  };

  const deleteDurableGood = (id: string) => {
    setDurableGoods(prev => prev.filter(g => g.id !== id));
    addAuditLogDirect('ลบครุภัณฑ์ (DELETE_DURABLE_GOOD)', `ครุภัณฑ์ ID ${id}`, `ลบข้อมูลครุภัณฑ์`);
    triggerSheetsSync();
  };

  // Vendors
  const addVendor = (vendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `VEN-${Date.now().toString().slice(-4)}`
    };
    setVendors(prev => [...prev, newVendor]);
    addAuditLogDirect('เพิ่มผู้จำหน่าย (ADD_VENDOR)', `ร้านค้า ${vendorData.name}`, `เพิ่มรายชื่อผู้จำหน่าย`);
    triggerSheetsSync();
  };

  const updateVendor = (id: string, vendorData: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...vendorData } : v));
    addAuditLogDirect('แก้ไขผู้จำหน่าย (UPDATE_VENDOR)', `ร้านค้า ID ${id}`, `แก้ไขข้อมูลผู้จำหน่าย`);
    triggerSheetsSync();
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    addAuditLogDirect('ลบผู้จำหน่าย (DELETE_VENDOR)', `ร้านค้า ID ${id}`, `ลบรายชื่อผู้จำหน่าย`);
    triggerSheetsSync();
  };

  // Budget
  const addBudgetAllocation = (budgetData: Omit<BudgetAllocation, 'id' | 'updatedAt'>) => {
    const newBudget: BudgetAllocation = {
      ...budgetData,
      id: `BUD-${settings.fiscalYear}-${Date.now().toString().slice(-3)}`,
      updatedAt: new Date().toISOString()
    };
    setBudgets(prev => [...prev, newBudget]);
    addAuditLogDirect('เพิ่มจัดสรรงบประมาณ (ADD_BUDGET)', `แผนก ${budgetData.departmentName}`, `จัดสรรงบประมาณปี ${budgetData.fiscalYear} จำนวน ${budgetData.allocatedAmount} บาท`);
    triggerSheetsSync();
  };

  const updateBudgetAllocation = (id: string, budgetData: Partial<BudgetAllocation>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...budgetData, updatedAt: new Date().toISOString() } : b));
    addAuditLogDirect('แก้ไขจัดสรรงบประมาณ (UPDATE_BUDGET)', `งบประมาณ ID ${id}`, `แก้ไขวงเงินงบประมาณ`);
    triggerSheetsSync();
  };

  // Requisitions Engine (Rule #11, Rule #12: Auto doc sequence REQ-2569-xxxx / TEM-2569-xxxx)
  const createRequisition = (
    data: Omit<Requisition, 'id' | 'docNo' | 'status' | 'createdAt' | 'updatedAt' | 'mode' | 'updatedBy'>,
    isDraft = false
  ) => {
    const isDemo = mode === 'DEMO';
    const reqList = isDemo ? requisitionsDemo : requisitionsLive;
    const prefix = isDemo ? 'TEM' : 'REQ';
    const seq = String(reqList.length + 1).padStart(4, '0');
    const docNo = `${prefix}-${settings.fiscalYear}-${seq}`;
    
    const newReq: Requisition = {
      ...data,
      id: `${prefix}-ID-${Date.now()}`,
      docNo,
      status: isDraft ? 'DRAFT' : 'PENDING',
      fiscalYear: settings.fiscalYear,
      academicYear: settings.academicYear,
      semester: settings.semester,
      mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: user.name
    };

    if (isDemo) {
      setRequisitionsDemo(prev => [newReq, ...prev]);
    } else {
      setRequisitionsLive(prev => [newReq, ...prev]);
    }

    addAuditLogDirect(
      isDraft ? 'บันทึกแบบร่างคำขอเบิก (DRAFT_REQUISITION)' : 'ยื่นคำขอเบิกพัสดุ (SUBMIT_REQUISITION)',
      `เอกสาร ${docNo}`,
      `ผู้ขอเบิก ${data.requesterName} (${data.departmentName}) จำนวน ${data.items.length} รายการ ยอดรวม ${data.totalAmount} บาท (${mode})`
    );

    triggerSheetsSync();
  };

  const updateRequisition = (id: string, data: Partial<Requisition>) => {
    const isDemo = mode === 'DEMO';
    const updater = (prev: Requisition[]) => prev.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString(), updatedBy: user.name } : r);
    if (isDemo) {
      setRequisitionsDemo(updater);
    } else {
      setRequisitionsLive(updater);
    }
    addAuditLogDirect('แก้ไขคำขอเบิกพัสดุ (UPDATE_REQUISITION)', `คำขอ ID ${id}`, `แก้ไขรายละเอียดคำขอเบิก`);
    triggerSheetsSync();
  };

  const cancelRequisition = (id: string, comment?: string) => {
    const isDemo = mode === 'DEMO';
    const reqList = isDemo ? requisitionsDemo : requisitionsLive;
    const target = reqList.find(r => r.id === id);
    if (!target) return;

    const updater = (prev: Requisition[]) => prev.map(r => r.id === id ? { 
      ...r, 
      status: 'CANCELLED' as RequisitionStatus, 
      approvalComment: comment || 'ผู้ขอเบิกยกเลิกรายการ',
      updatedAt: new Date().toISOString(), 
      updatedBy: user.name 
    } : r);

    if (isDemo) {
      setRequisitionsDemo(updater);
    } else {
      setRequisitionsLive(updater);
    }

    addAuditLogDirect('ยกเลิกคำขอเบิก (CANCEL_REQUISITION)', `เอกสาร ${target.docNo}`, `ผู้ขอเบิก/แอดมิน ยกเลิกคำขอเบิก`);
    triggerSheetsSync();
  };

  const approveRequisition = (id: string, comment: string, itemsApprovedQty?: Record<string, number>) => {
    const isDemo = mode === 'DEMO';
    const reqList = isDemo ? requisitionsDemo : requisitionsLive;
    const target = reqList.find(r => r.id === id);
    if (!target) return;

    // Update item approved quantities if modified
    const updatedItems = target.items.map(item => {
      const appQty = itemsApprovedQty && itemsApprovedQty[item.materialId] !== undefined 
        ? itemsApprovedQty[item.materialId] 
        : item.requestedQty;
      return {
        ...item,
        approvedQty: appQty
      };
    });

    const updater = (prev: Requisition[]) => prev.map(r => r.id === id ? {
      ...r,
      items: updatedItems,
      status: 'APPROVED' as RequisitionStatus,
      approverId: user.id,
      approverName: user.name,
      approvedAt: new Date().toISOString(),
      approvalComment: comment,
      updatedAt: new Date().toISOString(),
      updatedBy: user.name
    } : r);

    if (isDemo) {
      setRequisitionsDemo(updater);
    } else {
      setRequisitionsLive(updater);
    }

    // Deduct from department used budget
    setDepartments(prev => prev.map(d => d.id === target.departmentId ? { ...d, budgetUsed: d.budgetUsed + target.totalAmount } : d));

    addAuditLogDirect('อนุมัติคำขอเบิก (APPROVE_REQUISITION)', `เอกสาร ${target.docNo}`, `ผู้อนุมัติ ${user.name} อนุมัติคำขอเบิก ยอด ${target.totalAmount} บาท`);
    triggerSheetsSync();
  };

  const rejectRequisition = (id: string, comment: string) => {
    const isDemo = mode === 'DEMO';
    const reqList = isDemo ? requisitionsDemo : requisitionsLive;
    const target = reqList.find(r => r.id === id);
    if (!target) return;

    const updater = (prev: Requisition[]) => prev.map(r => r.id === id ? {
      ...r,
      status: 'REJECTED' as RequisitionStatus,
      approverId: user.id,
      approverName: user.name,
      approvedAt: new Date().toISOString(),
      approvalComment: comment,
      updatedAt: new Date().toISOString(),
      updatedBy: user.name
    } : r);

    if (isDemo) {
      setRequisitionsDemo(updater);
    } else {
      setRequisitionsLive(updater);
    }

    addAuditLogDirect('ปฏิเสธคำขอเบิก (REJECT_REQUISITION)', `เอกสาร ${target.docNo}`, `ผู้อนุมัติ ${user.name} ปฏิเสธคำขอเบิก เหตุผล: ${comment}`);
    triggerSheetsSync();
  };

  const sendBackRequisition = (id: string, comment: string) => {
    const isDemo = mode === 'DEMO';
    const reqList = isDemo ? requisitionsDemo : requisitionsLive;
    const target = reqList.find(r => r.id === id);
    if (!target) return;

    const updater = (prev: Requisition[]) => prev.map(r => r.id === id ? {
      ...r,
      status: 'RETURNED' as RequisitionStatus,
      approverId: user.id,
      approverName: user.name,
      approvalComment: comment,
      updatedAt: new Date().toISOString(),
      updatedBy: user.name
    } : r);

    if (isDemo) {
      setRequisitionsDemo(updater);
    } else {
      setRequisitionsLive(updater);
    }

    addAuditLogDirect('ส่งกลับแก้ไขคำขอเบิก (RETURN_REQUISITION)', `เอกสาร ${target.docNo}`, `ส่งกลับให้ผู้ขอแก้ไข เหตุผล: ${comment}`);
    triggerSheetsSync();
  };

  const receiveRequisition = (id: string) => {
    const isDemo = mode === 'DEMO';
    const reqList = isDemo ? requisitionsDemo : requisitionsLive;
    const target = reqList.find(r => r.id === id);
    if (!target) return;

    // Deduct stock levels from inventory
    const matUpdater = (prev: Material[]) => prev.map(m => {
      const matchItem = target.items.find(i => i.materialId === m.id);
      if (matchItem) {
        const qtyToDeduct = matchItem.approvedQty !== undefined ? matchItem.approvedQty : matchItem.requestedQty;
        return {
          ...m,
          stockQty: Math.max(0, m.stockQty - qtyToDeduct),
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    });

    if (isDemo) {
      setMaterialsDemo(matUpdater);
    } else {
      setMaterialsLive(matUpdater);
    }

    // Update requisition status to RECEIVED / DISPATCHED
    const reqUpdater = (prev: Requisition[]) => prev.map(r => r.id === id ? {
      ...r,
      status: 'RECEIVED' as RequisitionStatus,
      dispatchedAt: new Date().toISOString(),
      dispatcherName: user.name,
      receivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: user.name
    } : r);

    if (isDemo) {
      setRequisitionsDemo(reqUpdater);
    } else {
      setRequisitionsLive(reqUpdater);
    }

    addAuditLogDirect('จ่ายพัสดุ / ยืนยันรับของ (DISPATCH_RECEIVED)', `เอกสาร ${target.docNo}`, `ตัดสต็อกพัสดุคงคลังและยืนยันรับของเรียบร้อย`);
    triggerSheetsSync();
  };

  const getAppsScriptCode = () => {
    return generateGoogleAppsScriptCode();
  };

  // Return current materials & requisitions based on active mode (Strict Rule #11 & Rule #12)
  const currentMaterials = mode === 'DEMO' ? materialsDemo : materialsLive;
  const currentRequisitions = mode === 'DEMO' ? requisitionsDemo : requisitionsLive;

  return (
    <AppContext.Provider value={{
      user,
      language,
      mode,
      settings,
      users,
      departments,
      materials: currentMaterials,
      materialsLive,
      materialsDemo,
      durableGoods,
      vendors,
      budgets,
      requisitions: currentRequisitions,
      requisitionsLive,
      requisitionsDemo,
      auditLogs,
      confirmDialog,
      isSyncing,
      lastSyncMessage,

      switchLanguage,
      switchRole,
      toggleDemoMode,
      generateDemoData,
      purgeDemoData,
      updateSettings,

      addDepartment,
      updateDepartment,
      deleteDepartment,

      addUser,
      updateUser,
      deleteUser,

      addMaterial,
      updateMaterial,
      deleteMaterial,
      adjustStock,

      addDurableGood,
      updateDurableGood,
      deleteDurableGood,

      addVendor,
      updateVendor,
      deleteVendor,

      addBudgetAllocation,
      updateBudgetAllocation,

      createRequisition,
      updateRequisition,
      cancelRequisition,
      approveRequisition,
      rejectRequisition,
      sendBackRequisition,
      receiveRequisition,

      addAuditLog,
      showConfirmDialog,
      hideConfirmDialog,
      triggerSheetsSync,
      getAppsScriptCode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
