import { Department, Material, DurableGood, Vendor, BudgetAllocation, User, Requisition, AuditLog, SystemSettings } from '../types';

export const initialSettings: SystemSettings = {
  systemName: 'ระบบบริหารการเบิก-จ่ายพัสดุโรงเรียนและหน่วยงานภาครัฐ',
  systemNameEn: 'School & Public Sector Inventory Requisition System',
  systemShortName: 'SATIT-INV',
  adminName: 'นายผู้ดูแลระบบ พัสดุดี',
  adminEmail: 'admin@school.ac.th',
  adminPosition: 'นักจัดการงานทั่วไปชำนาญการ (ผู้ดูแลระบบ)',
  fiscalYear: '2569',
  academicYear: '2568',
  semester: '1',
  systemActive: true,
  forwardingActive: true,
  trackingActive: true,
  demoModeActive: false,
  departmentsList: [
    'ฝ่ายวิชาการ',
    'ฝ่ายบริหารทั่วไปและแผนงาน',
    'หมวดวิชาคอมพิวเตอร์และเทคโนโลยี',
    'หมวดวิชาวิทยาศาสตร์และเทคโนโลยี',
    'หมวดวิชาภาษาต่างประเทศ',
    'งานพัสดุและอาคารสถานที่',
    'สำนักงานผู้อำนวยการ'
  ],
  googleSpreadsheetId: '1YH4Ga8L6qxCppZQZdCmRyL46KT7n2a3yc_DiTEXhdVM',
  googleWebAppUrl: 'https://script.google.com/macros/s/AKfycbwLwtsWXp5_tqyy_w6VJBUT2FEQYQ90gATKX7DQw6PaOVWFQO7o2twCHUHq5ksslq5W/exec',
  lastSyncedAt: new Date().toISOString()
};

export const initialUsers: User[] = [
  {
    id: 'USR-001',
    username: 'admin',
    name: 'นายผู้ดูแลระบบ พัสดุดี',
    email: 'admin@school.ac.th',
    role: 'ADMIN',
    departmentId: 'DEP-006',
    departmentName: 'งานพัสดุและอาคารสถานที่',
    position: 'เจ้าหน้าที่ระบบคอมพิวเตอร์ / Admin',
    phone: '081-123-4567',
    active: true,
    createdAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'USR-002',
    username: 'teacher',
    name: 'ครูสมชาย ใจดี',
    email: 'somchai@school.ac.th',
    role: 'REQUESTER',
    departmentId: 'DEP-001',
    departmentName: 'ฝ่ายวิชาการ',
    position: 'ครู ชำนาญการพิเศษ',
    phone: '082-345-6789',
    active: true,
    createdAt: '2026-01-11T09:00:00Z'
  },
  {
    id: 'USR-003',
    username: 'inventory',
    name: 'นายพัสดุ มั่นคง',
    email: 'passadu@school.ac.th',
    role: 'INVENTORY_OFFICER',
    departmentId: 'DEP-006',
    departmentName: 'งานพัสดุและอาคารสถานที่',
    position: 'เจ้าพนักงานพัสดุชำนาญงาน',
    phone: '083-456-7890',
    active: true,
    createdAt: '2026-01-12T10:00:00Z'
  },
  {
    id: 'USR-004',
    username: 'approver',
    name: 'ดร.วิชัย หัวหน้าวิชาการ',
    email: 'wichai@school.ac.th',
    role: 'APPROVER',
    departmentId: 'DEP-001',
    departmentName: 'ฝ่ายวิชาการ',
    position: 'หัวหน้าฝ่ายวิชาการ',
    phone: '084-567-8901',
    active: true,
    createdAt: '2026-01-12T11:00:00Z'
  },
  {
    id: 'USR-005',
    username: 'executive',
    name: 'ดร.สมศักดิ์ บริหารงาน (ผู้อำนวยการ)',
    email: 'director@school.ac.th',
    role: 'EXECUTIVE',
    departmentId: 'DEP-007',
    departmentName: 'สำนักงานผู้อำนวยการ',
    position: 'ผู้อำนวยการโรงเรียน',
    phone: '085-678-9012',
    active: true,
    createdAt: '2026-01-13T12:00:00Z'
  }
];

export const initialDepartments: Department[] = [
  {
    id: 'DEP-001',
    code: 'ACAD',
    name: 'ฝ่ายวิชาการ',
    nameEn: 'Academic Affairs Department',
    headName: 'ดร.วิชัย หัวหน้าวิชาการ',
    budgetAllocated: 250000,
    budgetUsed: 84500,
    active: true
  },
  {
    id: 'DEP-002',
    code: 'GEN',
    name: 'ฝ่ายบริหารทั่วไปและแผนงาน',
    nameEn: 'General Administration & Planning',
    headName: 'นางสาววิไล บริหารดี',
    budgetAllocated: 300000,
    budgetUsed: 112000,
    active: true
  },
  {
    id: 'DEP-003',
    code: 'COMP',
    name: 'หมวดวิชาคอมพิวเตอร์และเทคโนโลยี',
    nameEn: 'Computer & Information Tech Dept',
    headName: 'อาจารย์พิชิต ไอที',
    budgetAllocated: 180000,
    budgetUsed: 62000,
    active: true
  },
  {
    id: 'DEP-004',
    code: 'SCI',
    name: 'หมวดวิชาวิทยาศาสตร์และเทคโนโลยี',
    nameEn: 'Science & Innovation Dept',
    headName: 'ดร.กัญญารัตน์ วิทย์เก่ง',
    budgetAllocated: 200000,
    budgetUsed: 75000,
    active: true
  },
  {
    id: 'DEP-005',
    code: 'LANG',
    name: 'หมวดวิชาภาษาต่างประเทศ',
    nameEn: 'Foreign Languages Dept',
    headName: 'Mr. David Smith',
    budgetAllocated: 150000,
    budgetUsed: 43000,
    active: true
  },
  {
    id: 'DEP-006',
    code: 'SUPP',
    name: 'งานพัสดุและอาคารสถานที่',
    nameEn: 'Supply & Facilities Division',
    headName: 'นายพัสดุ มั่นคง',
    budgetAllocated: 500000,
    budgetUsed: 195000,
    active: true
  },
  {
    id: 'DEP-007',
    code: 'EXEC',
    name: 'สำนักงานผู้อำนวยการ',
    nameEn: 'Office of the Director',
    headName: 'ดร.สมศักดิ์ บริหารงาน',
    budgetAllocated: 400000,
    budgetUsed: 120000,
    active: true
  }
];

export const initialMaterialsLive: Material[] = [
  {
    id: 'MAT-001',
    code: 'MAT-A4-80G',
    name: 'กระดาษ A4 80 แกรม Double A (กล่อง 5 รีม)',
    category: 'วัสดุสำนักงาน',
    unit: 'กล่อง',
    stockQty: 42,
    minQty: 10,
    unitPrice: 580,
    location: 'ตู้ B-01 คลังพัสดุกลาง',
    mode: 'LIVE',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'MAT-002',
    code: 'MAT-WB-BLU',
    name: 'ปากกาไวท์บอร์ด PILOT WBMK (สีน้ำเงิน)',
    category: 'วัสดุการศึกษา',
    unit: 'ด้าม',
    stockQty: 120,
    minQty: 30,
    unitPrice: 28,
    location: 'ชั้น A-03 อาคารพัสดุ',
    mode: 'LIVE',
    updatedAt: '2026-08-02T11:00:00Z'
  },
  {
    id: 'MAT-003',
    code: 'MAT-TON-HP',
    name: 'ตลับหมึกพิมพ์เลเซอร์ HP LaserJet Black 85A',
    category: 'วัสดุคอมพิวเตอร์',
    unit: 'ตลับ',
    stockQty: 8,
    minQty: 3,
    unitPrice: 2150,
    location: 'ตู้ล็อกเกอร์ IT-02',
    mode: 'LIVE',
    updatedAt: '2026-08-03T14:00:00Z'
  },
  {
    id: 'MAT-004',
    code: 'MAT-FD-32G',
    name: 'แฟลชไดรฟ์ USB 3.0 ความจุ 32GB Kingston',
    category: 'วัสดุคอมพิวเตอร์',
    unit: 'อัน',
    stockQty: 25,
    minQty: 5,
    unitPrice: 190,
    location: 'ตู้ล็อกเกอร์ IT-01',
    mode: 'LIVE',
    updatedAt: '2026-08-04T09:30:00Z'
  },
  {
    id: 'MAT-005',
    code: 'MAT-CLIP-108',
    name: 'คลิปหนีบดำ เบอร์ 108 ขนาด 50 มม. (กล่อง 12 ตัว)',
    category: 'วัสดุสำนักงาน',
    unit: 'กล่อง',
    stockQty: 65,
    minQty: 15,
    unitPrice: 45,
    location: 'ตู้ A-02 อาคารพัสดุ',
    mode: 'LIVE',
    updatedAt: '2026-08-05T13:15:00Z'
  },
  {
    id: 'MAT-006',
    code: 'MAT-BOOK-100',
    name: 'สมุดรายงานปกแข็ง 100 แผ่น ตราช้าง',
    category: 'วัสดุการศึกษา',
    unit: 'เล่ม',
    stockQty: 80,
    minQty: 20,
    unitPrice: 65,
    location: 'ชั้น B-04 อาคารพัสดุ',
    mode: 'LIVE',
    updatedAt: '2026-08-06T15:45:00Z'
  }
];

export const initialMaterialsDemo: Material[] = [
  {
    id: 'DEMO-MAT-001',
    code: 'DEMO-PAPER-01',
    name: 'กระดาษทดสอบสำหรับ Demo A4 70G',
    category: 'วัสดุสำนักงาน (DEMO)',
    unit: 'รีม',
    stockQty: 100,
    minQty: 10,
    unitPrice: 110,
    location: 'คลังทดลอง Demo Room',
    mode: 'DEMO',
    updatedAt: '2026-08-08T01:00:00Z'
  },
  {
    id: 'DEMO-MAT-002',
    code: 'DEMO-PEN-RED',
    name: 'ปากกาแดงสำหรับทดลองเบิก Demo Marker',
    category: 'วัสดุการศึกษา (DEMO)',
    unit: 'ด้าม',
    stockQty: 50,
    minQty: 5,
    unitPrice: 15,
    location: 'คลังทดลอง Demo Room',
    mode: 'DEMO',
    updatedAt: '2026-08-08T01:00:00Z'
  }
];

export const initialDurableGoods: DurableGood[] = [
  {
    id: 'DUR-001',
    code: 'สท-68-001/69',
    name: 'คอมพิวเตอร์ All-In-One Dell OptiPlex 24',
    serialNumber: 'CN-0987123-DELL',
    brandModel: 'Dell / OptiPlex 7410 AIO',
    category: 'ครุภัณฑ์คอมพิวเตอร์',
    purchaseDate: '2025-10-15',
    price: 32500,
    departmentId: 'DEP-003',
    departmentName: 'หมวดวิชาคอมพิวเตอร์และเทคโนโลยี',
    status: 'NORMAL',
    location: 'ห้องปฏิบัติการคอมพิวเตอร์ 1',
    mode: 'LIVE'
  },
  {
    id: 'DUR-002',
    code: 'สท-68-002/69',
    name: 'เครื่องพิมพ์มัลติฟังก์ชัน EPSON EcoTank L3250',
    serialNumber: 'EPS-L3250-88912',
    brandModel: 'Epson / EcoTank L3250 WiFi',
    category: 'ครุภัณฑ์สำนักงาน',
    purchaseDate: '2025-11-20',
    price: 5490,
    departmentId: 'DEP-001',
    departmentName: 'ฝ่ายวิชาการ',
    status: 'NORMAL',
    location: 'ห้องฝ่ายวิชาการ อาคาร 1 ชั้น 2',
    mode: 'LIVE'
  },
  {
    id: 'DUR-003',
    code: 'สท-68-003/69',
    name: 'เครื่องมัลติมีเดียโปรเจคเตอร์ Panasonic 3800 Lumens',
    serialNumber: 'PANA-PROJ-44321',
    brandModel: 'Panasonic / PT-LB386',
    category: 'ครุภัณฑ์การศึกษา',
    purchaseDate: '2025-08-10',
    price: 18900,
    departmentId: 'DEP-004',
    departmentName: 'หมวดวิชาวิทยาศาสตร์และเทคโนโลยี',
    status: 'REPAIR',
    location: 'ห้องประชุมวิทย์ 2',
    mode: 'LIVE'
  }
];

export const initialVendors: Vendor[] = [
  {
    id: 'VEN-001',
    code: 'VEN-OA',
    name: 'บริษัท โอเอ สเตชันเนอรี เซ็นเตอร์ จำกัด',
    taxId: '0105558123451',
    contactPerson: 'คุณพิศมัย จำหน่ายพัสดุ',
    phone: '02-890-1234',
    address: '123/45 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
    email: 'contact@oastationery.co.th',
    active: true
  },
  {
    id: 'VEN-002',
    code: 'VEN-IT',
    name: 'บริษัท สยามไอที อินฟราสตรัคเจอร์ จำกัด',
    taxId: '0105559876543',
    contactPerson: 'คุณอรรถพล ไอทีดี',
    phone: '02-555-8899',
    address: '88/9 ถนนแจ้งวัฒนะ หลักสี่ กรุงเทพฯ 10210',
    email: 'sales@siamit.co.th',
    active: true
  }
];

export const initialBudgets: BudgetAllocation[] = [
  {
    id: 'BUD-2569-001',
    fiscalYear: '2569',
    departmentId: 'DEP-001',
    departmentName: 'ฝ่ายวิชาการ',
    allocatedAmount: 250000,
    usedAmount: 84500,
    remainingAmount: 165500,
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'BUD-2569-002',
    fiscalYear: '2569',
    departmentId: 'DEP-002',
    departmentName: 'ฝ่ายบริหารทั่วไปและแผนงาน',
    allocatedAmount: 300000,
    usedAmount: 112000,
    remainingAmount: 188000,
    updatedAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'BUD-2569-003',
    fiscalYear: '2569',
    departmentId: 'DEP-003',
    departmentName: 'หมวดวิชาคอมพิวเตอร์และเทคโนโลยี',
    allocatedAmount: 180000,
    usedAmount: 62000,
    remainingAmount: 118000,
    updatedAt: '2026-08-01T08:00:00Z'
  }
];

export const initialRequisitionsLive: Requisition[] = [
  {
    id: 'REQ-ID-001',
    docNo: 'REQ-2569-0001',
    requesterId: 'USR-002',
    requesterName: 'ครูสมชาย ใจดี',
    departmentId: 'DEP-001',
    departmentName: 'ฝ่ายวิชาการ',
    requesterPosition: 'ครู ชำนาญการพิเศษ',
    reason: 'ขอเบิกกระดาษ A4 และตลับหมึกเพื่อจัดพิมพ์แบบทดสอบวัดผลสัมฤทธิ์กลางภาคเรียน',
    items: [
      {
        materialId: 'MAT-001',
        materialCode: 'MAT-A4-80G',
        materialName: 'กระดาษ A4 80 แกรม Double A (กล่อง 5 รีม)',
        unit: 'กล่อง',
        unitPrice: 580,
        requestedQty: 3,
        approvedQty: 3,
        dispatchedQty: 3,
        totalPrice: 1740
      },
      {
        materialId: 'MAT-003',
        materialCode: 'MAT-TON-HP',
        materialName: 'ตลับหมึกพิมพ์เลเซอร์ HP LaserJet Black 85A',
        unit: 'ตลับ',
        unitPrice: 2150,
        requestedQty: 1,
        approvedQty: 1,
        dispatchedQty: 1,
        totalPrice: 2150
      }
    ],
    totalAmount: 3890,
    status: 'RECEIVED',
    fiscalYear: '2569',
    academicYear: '2568',
    semester: '1',
    mode: 'LIVE',
    createdAt: '2026-08-02T09:15:00Z',
    updatedAt: '2026-08-03T11:00:00Z',
    updatedBy: 'นายพัสดุ มั่นคง',
    approverId: 'USR-004',
    approverName: 'ดร.วิชัย หัวหน้าวิชาการ',
    approvedAt: '2026-08-02T14:30:00Z',
    approvalComment: 'อนุมัติให้ตามความจำเป็นเพื่อการจัดสอบกลางภาค',
    dispatchedAt: '2026-08-03T10:00:00Z',
    dispatcherName: 'นายพัสดุ มั่นคง',
    receivedAt: '2026-08-03T11:00:00Z'
  },
  {
    id: 'REQ-ID-002',
    docNo: 'REQ-2569-0002',
    requesterId: 'USR-002',
    requesterName: 'ครูสมชาย ใจดี',
    departmentId: 'DEP-001',
    departmentName: 'ฝ่ายวิชาการ',
    requesterPosition: 'ครู ชำนาญการพิเศษ',
    reason: 'ขอเบิกปากกาไวท์บอร์ดสำหรับใช้ในห้องเรียนหมวดวิชาการ',
    items: [
      {
        materialId: 'MAT-002',
        materialCode: 'MAT-WB-BLU',
        materialName: 'ปากกาไวท์บอร์ด PILOT WBMK (สีน้ำเงิน)',
        unit: 'ด้าม',
        unitPrice: 28,
        requestedQty: 20,
        approvedQty: 20,
        totalPrice: 560
      }
    ],
    totalAmount: 560,
    status: 'PENDING',
    fiscalYear: '2569',
    academicYear: '2568',
    semester: '1',
    mode: 'LIVE',
    createdAt: '2026-08-07T10:00:00Z',
    updatedAt: '2026-08-07T10:00:00Z',
    updatedBy: 'ครูสมชาย ใจดี'
  }
];

export const initialRequisitionsDemo: Requisition[] = [
  {
    id: 'DEMO-REQ-001',
    docNo: 'TEM-2569-0001',
    requesterId: 'USR-002',
    requesterName: 'ครูสมชาย ใจดี (Demo User)',
    departmentId: 'DEP-001',
    departmentName: 'ฝ่ายวิชาการ (Demo)',
    requesterPosition: 'ครูผู้สอน',
    reason: 'ทดลองส่งคำขอเบิกพัสดุในโหมด DEMO',
    items: [
      {
        materialId: 'DEMO-MAT-001',
        materialCode: 'DEMO-PAPER-01',
        materialName: 'กระดาษทดสอบสำหรับ Demo A4 70G',
        unit: 'รีม',
        unitPrice: 110,
        requestedQty: 5,
        approvedQty: 5,
        totalPrice: 550
      }
    ],
    totalAmount: 550,
    status: 'PENDING',
    fiscalYear: '2569',
    academicYear: '2568',
    semester: '1',
    mode: 'DEMO',
    createdAt: '2026-08-08T01:10:00Z',
    updatedAt: '2026-08-08T01:10:00Z',
    updatedBy: 'ครูสมชาย ใจดี (Demo User)'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-08-02T09:15:00Z',
    userId: 'USR-002',
    userName: 'ครูสมชาย ใจดี',
    userRole: 'REQUESTER',
    action: 'สร้างคำขอเบิก (REQUISITION_CREATE)',
    targetEntity: 'คำขอเบิก REQ-2569-0001',
    details: 'ยื่นคำขอเบิกจำนวน 2 รายการ ยอดรวม 3,890 บาท',
    mode: 'LIVE'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-08-02T14:30:00Z',
    userId: 'USR-004',
    userName: 'ดร.วิชัย หัวหน้าวิชาการ',
    userRole: 'APPROVER',
    action: 'อนุมัติคำขอ (REQUISITION_APPROVE)',
    targetEntity: 'คำขอเบิก REQ-2569-0001',
    details: 'อนุมัติคำขอเบิกเต็มจำนวน พร้อมหมายเหตุ: อนุมัติให้ตามความจำเป็น',
    mode: 'LIVE'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-08-03T11:00:00Z',
    userId: 'USR-003',
    userName: 'นายพัสดุ มั่นคง',
    userRole: 'INVENTORY_OFFICER',
    action: 'จ่ายพัสดุ (REQUISITION_DISPATCH)',
    targetEntity: 'คำขอเบิก REQ-2569-0001',
    details: 'ดำเนินการตัดยอดพัสดุและส่งมอบพัสดุแก่ผู้ขอเบิกเรียบร้อย',
    mode: 'LIVE'
  }
];
