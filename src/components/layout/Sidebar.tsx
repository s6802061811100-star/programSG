import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { 
  LayoutDashboard, Users, ShieldCheck, Building, 
  Package, Box, Truck, Coins, BarChart3, 
  History, Settings, FilePlus, ClipboardList, 
  PackageSearch, CheckSquare, Sparkles, Building2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, settings, language, mode } = useApp();
  const t = translations[language];

  // Helper to build menu items grouped into sections based on current user role
  const getMenuSections = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          {
            title: language === 'th' ? 'เมนูหลัก / Main Menu' : 'Main Menu',
            items: [
              { id: 'dashboard', label: t.menuDashboard, icon: LayoutDashboard },
              { id: 'requisition', label: t.menuRequisition, icon: FilePlus },
              { id: 'my-requisitions', label: 'คำขอเบิกทั้งหมด', icon: ClipboardList },
              { id: 'users', label: t.menuUsers, icon: Users },
              { id: 'roles', label: t.menuRoles, icon: ShieldCheck },
              { id: 'departments', label: t.menuDepartments, icon: Building },
              { id: 'materials', label: t.menuMaterials, icon: Package },
              { id: 'durable-goods', label: t.menuDurableGoods, icon: Box },
              { id: 'suppliers', label: t.menuSuppliers, icon: Truck },
            ]
          },
          {
            title: language === 'th' ? 'การเงิน & รายงาน / Finance & Report' : 'Finance & Report',
            items: [
              { id: 'budget', label: t.menuBudget, icon: Coins },
              { id: 'reports', label: t.menuReports, icon: BarChart3 },
            ]
          },
          {
            title: language === 'th' ? 'ผู้ดูแลระบบ / Admin Panel' : 'Admin Panel',
            items: [
              { id: 'audit-log', label: t.menuAuditLog, icon: History },
              { id: 'settings', label: t.menuSettings, icon: Settings },
            ]
          }
        ];

      case 'REQUESTER':
        return [
          {
            title: language === 'th' ? 'บริการเบิกจ่าย / Request Menu' : 'Request Menu',
            items: [
              { id: 'create-request', label: t.menuRequisition, icon: FilePlus },
              { id: 'my-requisitions', label: t.menuMyRequisitions, icon: ClipboardList },
              { id: 'material-catalog', label: t.menuInventoryStock, icon: PackageSearch },
            ]
          }
        ];

      case 'INVENTORY_OFFICER':
        return [
          {
            title: language === 'th' ? 'จัดการคลังพัสดุ / Inventory' : 'Inventory',
            items: [
              { id: 'dashboard', label: t.menuDashboard, icon: LayoutDashboard },
              { id: 'inventory-requests', label: 'จัดการคำขอเบิก-จ่าย', icon: ClipboardList },
              { id: 'materials', label: t.menuMaterials, icon: Package },
              { id: 'durable-goods', label: t.menuDurableGoods, icon: Box },
              { id: 'suppliers', label: t.menuSuppliers, icon: Truck },
            ]
          },
          {
            title: language === 'th' ? 'รายงาน / Reports' : 'Reports',
            items: [
              { id: 'reports', label: t.menuReports, icon: BarChart3 },
            ]
          }
        ];

      case 'APPROVER':
        return [
          {
            title: language === 'th' ? 'การอนุมัติ / Approvals' : 'Approvals',
            items: [
              { id: 'dashboard', label: t.menuDashboard, icon: LayoutDashboard },
              { id: 'pending-approvals', label: t.menuApprovals, icon: CheckSquare },
              { id: 'department-budget', label: 'งบประมาณหน่วยงาน', icon: Coins },
              { id: 'material-catalog', label: 'ตรวจสอบพัสดุคงคลัง', icon: PackageSearch },
              { id: 'approval-reports', label: 'ประวัติอนุมัติ & รายงาน', icon: BarChart3 },
            ]
          }
        ];

      case 'EXECUTIVE':
        return [
          {
            title: language === 'th' ? 'ผู้บริหาร / Executive Overview' : 'Executive Overview',
            items: [
              { id: 'dashboard', label: t.menuDashboard, icon: LayoutDashboard },
              { id: 'reports', label: t.menuReports, icon: BarChart3 },
            ]
          }
        ];

      default:
        return [
          {
            title: 'Menu',
            items: [
              { id: 'dashboard', label: t.menuDashboard, icon: LayoutDashboard },
            ]
          }
        ];
    }
  };

  const sections = getMenuSections();

  return (
    <aside className="w-full md:w-64 h-full bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      
      {/* Top Header / Branding */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xl shadow-sm shrink-0">
          S
        </div>
        <div className="overflow-hidden min-w-0">
          <div className="text-white font-bold text-sm leading-tight uppercase tracking-wider truncate">
            {settings.systemShortName || 'SATIT-INV'}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
            Gov-System v2.5
          </div>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {mode === 'DEMO' && (
        <div className="mx-3 mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-amber-200 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t.demoMode}
          </div>
          <p className="text-[10px] text-amber-300/80 leading-tight">
            {t.demoNotice}
          </p>
        </div>
      )}

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx}>
            <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1.5 tracking-widest">
              {section.title}
            </div>
            <div className="space-y-1 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-xs font-medium text-left ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Current User Badge */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold shrink-0">
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="overflow-hidden min-w-0">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-slate-400 truncate">
              {user.departmentName || user.role}
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
