import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { UserRole } from '../../types';
import { 
  Globe, RefreshCw, Code2, ShieldAlert, 
  ChevronDown, UserCheck, Sparkles, Database, Search, Bell 
} from 'lucide-react';
import { GoogleScriptModal } from '../common/GoogleScriptModal';

export const Navbar: React.FC = () => {
  const { 
    settings, user, language, mode, switchLanguage, 
    switchRole, toggleDemoMode, isSyncing, triggerSheetsSync 
  } = useApp();
  const t = translations[language];

  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const rolesList: { role: UserRole; title: string }[] = [
    { role: 'ADMIN', title: t.roleAdmin },
    { role: 'REQUESTER', title: t.roleRequester },
    { role: 'APPROVER', title: t.roleApprover },
    { role: 'INVENTORY_OFFICER', title: t.roleInventoryOfficer },
    { role: 'EXECUTIVE', title: t.roleExecutive }
  ];

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
        
        {/* Left Page Title & Status Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
            {language === 'th' ? settings.systemName : settings.systemNameEn}
          </h1>
          {mode === 'DEMO' ? (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-200 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              DEMO MODE
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider border border-emerald-200 inline-flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-600" />
              REAL MODE
            </span>
          )}
        </div>

        {/* Right Action Tools & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Quick Search Box */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder={language === 'th' ? 'ค้นหาเลขที่คำขอ / พัสดุ...' : 'Search REQ / item...'} 
              className="bg-transparent text-xs text-slate-800 focus:outline-none w-36 lg:w-48 placeholder-slate-400"
            />
          </div>

          {/* Fiscal Year Label */}
          <div className="hidden xl:block text-right border-l border-slate-200 pl-4">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === 'th' ? 'ปีงบประมาณ' : 'Fiscal Year'}
            </div>
            <div className="text-xs font-bold text-blue-600 uppercase">
              2569 / 2026
            </div>
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-200 pl-2 sm:pl-4">

            {/* Sync Button */}
            <button
              onClick={triggerSheetsSync}
              disabled={isSyncing}
              title={t.googleSheetsConnected}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">{isSyncing ? t.syncing : 'Sheets Sync'}</span>
            </button>

            {/* GAS Code Modal Trigger */}
            <button
              onClick={() => setIsGasModalOpen(true)}
              title={t.generateGasCode}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden lg:inline">{t.generateGasCode}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => switchLanguage(language === 'th' ? 'en' : 'th')}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1.5"
              title="Switch Language / สลับภาษา"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'th' ? 'TH' : 'EN'}</span>
            </button>

            {/* Role Switcher & User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-slate-800 border border-blue-200/80 transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-800 truncate max-w-[100px]">{user.name}</div>
                  <div className="text-[10px] text-blue-600 font-bold">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.switchRole}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">เลือกบทบาทเพื่อสลับการเข้าถึงระบบ</p>
                  </div>
                  
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {rolesList.map(r => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          user.role === r.role ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{r.title}</span>
                        {user.role === r.role && <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {user.role === 'ADMIN' && (
                    <div className="border-t border-slate-100 pt-2 px-4 pb-1">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                          โหมด Demo
                        </span>
                        <input
                          type="checkbox"
                          checked={mode === 'DEMO'}
                          onChange={(e) => toggleDemoMode(e.target.checked)}
                          className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </header>

      {/* Google Apps Script Modal */}
      <GoogleScriptModal isOpen={isGasModalOpen} onClose={() => setIsGasModalOpen(false)} />
    </>
  );
};
