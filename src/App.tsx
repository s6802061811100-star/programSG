import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ConfirmModal } from './components/common/ConfirmModal';
import { GoogleScriptModal } from './components/common/GoogleScriptModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { RequisitionView } from './components/views/RequisitionView';
import { ApprovalView } from './components/views/ApprovalView';
import { InventoryView } from './components/views/InventoryView';
import { DurableGoodsView } from './components/views/DurableGoodsView';
import { SuppliersView } from './components/views/SuppliersView';
import { UsersView } from './components/views/UsersView';
import { RolesView } from './components/views/RolesView';
import { DepartmentsView } from './components/views/DepartmentsView';
import { BudgetView } from './components/views/BudgetView';
import { ReportsView } from './components/views/ReportsView';
import { AuditLogView } from './components/views/AuditLogView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'requisition':
      case 'create-request':
      case 'my-requisitions':
      case 'material-catalog':
        return <RequisitionView />;
      case 'pending-approvals':
        return <ApprovalView />;
      case 'inventory-requests':
      case 'materials':
        return <InventoryView />;
      case 'durable-goods':
        return <DurableGoodsView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'users':
        return <UsersView />;
      case 'roles':
        return <RolesView />;
      case 'departments':
        return <DepartmentsView />;
      case 'budget':
      case 'department-budget':
        return <BudgetView />;
      case 'reports':
      case 'approval-reports':
        return <ReportsView />;
      case 'audit-log':
        return <AuditLogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header Navbar */}
        <Navbar />

        {/* Dynamic View Panel */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Reusable Modals */}
      <ConfirmModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
