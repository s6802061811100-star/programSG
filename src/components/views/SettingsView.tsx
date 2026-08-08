import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { 
  Settings, Building, Save, FileSpreadsheet, Code, 
  ToggleLeft, ToggleRight, Sparkles, Database, ExternalLink, RefreshCw, Cloud, ShieldCheck
} from 'lucide-react';
import { GoogleScriptModal } from '../common/GoogleScriptModal';
import { CloudflareModal } from '../common/CloudflareModal';

export const SettingsView: React.FC = () => {
  const { 
    settings, updateSettings, departments, updateDepartment, 
    mode, setMode, language, triggerSheetsSync, isSyncing, lastSyncMessage
  } = useApp();
  const t = translations[language];

  // Local Settings Form State
  const [formSettings, setFormSettings] = useState({ ...settings });
  const [deptNames, setDeptNames] = useState<Record<string, string>>(
    departments.reduce((acc, d) => ({ ...acc, [d.id]: d.name }), {})
  );

  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle Save All Settings
  const handleSaveAll = () => {
    // 1. Update System Settings parameters
    updateSettings(formSettings);

    // 2. Update Department Names in state
    departments.forEach(d => {
      if (deptNames[d.id] && deptNames[d.id] !== d.name) {
        updateDepartment(d.id, { name: deptNames[d.id] });
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ตั้งค่าระบบและการเชื่อมต่อ Google Sheets (System Settings)</h1>
          <p className="text-xs text-slate-500 mt-1">
            ปรับเปลี่ยนชื่อแผนก/หน่วยงาน กำหนดปีงบประมาณ และตั้งค่าพารามิเตอร์ระบบ 14 รายการ
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-emerald-200 transition-all"
        >
          <Save className="w-4 h-4" />
          {t.saveSettings}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!
        </div>
      )}

      {/* 1. Department Names Manager (Explicit Prompt Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building className="w-5 h-5 text-emerald-600" />
          1. เปลี่ยนชื่อแผนก / หน่วยงาน (Department Names)
        </h3>
        <p className="text-xs text-slate-500">
          ผู้ดูแลระบบสามารถแก้ไขชื่อแผนกวิชาเพื่อนำไปแสดงผลทั่วทั้งระบบและบันทึกลงใน Google Sheets ได้ที่นี่
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {departments.map((d) => (
            <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">{d.code}</label>
              <input
                type="text"
                value={deptNames[d.id] ?? d.name}
                onChange={(e) => setDeptNames({ ...deptNames, [d.id]: e.target.value })}
                className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. System Identity & Admin Info */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <Settings className="w-5 h-5 text-sky-600" />
          2. ข้อมูลระบบและผู้ดูแลระบบ (System & Admin Profile)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">ชื่อระบบ (System Name)</label>
            <input
              type="text"
              value={formSettings.systemName}
              onChange={(e) => setFormSettings({ ...formSettings, systemName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ชื่อย่อระบบ (Short Name)</label>
            <input
              type="text"
              value={formSettings.systemShortName}
              onChange={(e) => setFormSettings({ ...formSettings, systemShortName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ชื่อผู้ดูแลระบบ (Admin Name)</label>
            <input
              type="text"
              value={formSettings.adminName}
              onChange={(e) => setFormSettings({ ...formSettings, adminName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">อีเมลผู้ดูแลระบบ (Admin Email)</label>
            <input
              type="email"
              value={formSettings.adminEmail}
              onChange={(e) => setFormSettings({ ...formSettings, adminEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ตำแหน่งผู้ดูแลระบบ</label>
            <input
              type="text"
              value={formSettings.adminPosition}
              onChange={(e) => setFormSettings({ ...formSettings, adminPosition: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ปีงบประมาณ (Fiscal Year)</label>
            <input
              type="text"
              value={formSettings.fiscalYear}
              onChange={(e) => setFormSettings({ ...formSettings, fiscalYear: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ปีการศึกษา (Academic Year)</label>
            <input
              type="text"
              value={formSettings.academicYear}
              onChange={(e) => setFormSettings({ ...formSettings, academicYear: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ภาคเรียน (Semester)</label>
            <input
              type="text"
              value={formSettings.semester}
              onChange={(e) => setFormSettings({ ...formSettings, semester: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. System Feature Toggles & Demo Mode */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <ToggleLeft className="w-5 h-5 text-amber-600" />
          3. สวิตช์ควบคุมฟังก์ชันและโหมดการทำงาน (System Toggles)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Demo Mode Toggle */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-900">โหมด Demo (ทดลอง)</span>
              <button
                onClick={() => {
                  const newMode = mode === 'DEMO' ? 'LIVE' : 'DEMO';
                  setMode(newMode);
                  setFormSettings({ ...formSettings, isDemoMode: newMode === 'DEMO' });
                }}
                className={`p-1 rounded-full ${mode === 'DEMO' ? 'text-amber-600' : 'text-slate-400'}`}
              >
                {mode === 'DEMO' ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[11px] text-amber-700">ใช้ข้อมูลทดลอง ไม่กระทบ Google Sheets จริง</p>
          </div>

          {/* System Enabled Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">เปิดระบบเบิก-จ่าย</span>
              <button
                onClick={() => setFormSettings({ ...formSettings, isSystemEnabled: !formSettings.isSystemEnabled })}
                className={`p-1 rounded-full ${formSettings.isSystemEnabled ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                {formSettings.isSystemEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">อนุญาตให้ผู้ใช้สร้างคำขอเบิกได้</p>
          </div>

          {/* Forwarding Enabled Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">ระบบส่งต่อคำขอ</span>
              <button
                onClick={() => setFormSettings({ ...formSettings, isForwardingEnabled: !formSettings.isForwardingEnabled })}
                className={`p-1 rounded-full ${formSettings.isForwardingEnabled ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                {formSettings.isForwardingEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">ส่งต่อคำขออัตโนมัติตามลำดับขั้น</p>
          </div>

          {/* Tracking Enabled Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">ระบบติดตามเอกสาร</span>
              <button
                onClick={() => setFormSettings({ ...formSettings, isTrackingEnabled: !formSettings.isTrackingEnabled })}
                className={`p-1 rounded-full ${formSettings.isTrackingEnabled ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                {formSettings.isTrackingEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">ติดตามสถานะเบิกพัสดุแบบ Realtime</p>
          </div>

        </div>
      </div>

      {/* 4. Google Sheets Backend Connection & GAS Deployment Code */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              4. การเชื่อมต่อ Google Sheets & Apps Script Backend
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              นำ URL ที่ได้จากการ Deploy Google Apps Script Web App มาใส่ที่นี่เพื่อเปิดใช้งานระบบจริง
            </p>
          </div>

          <button
            onClick={() => setIsScriptModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Code className="w-4 h-4 text-emerald-400" />
            คัดลอกโค้ด Google Apps Script
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Spreadsheet ID / Link (ลิงก์หรือรหัส Google Sheet ของคุณ)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="1W9VaZo0p7kt_b1pECJApBqpAHLjuXvqXr5KZrAeT034 หรือวาง ลิงก์เต็ม"
                value={formSettings.googleSpreadsheetId || ''}
                onChange={(e) => {
                  let val = e.target.value.trim();
                  // Auto extract spreadsheet ID if user pastes full Google Sheets URL
                  const match = val.match(/\/d\/([a-zA-Z0-9-_]+)/);
                  if (match && match[1]) {
                    val = match[1];
                  }
                  setFormSettings({ ...formSettings, googleSpreadsheetId: val });
                }}
                className="w-full px-3.5 py-2 font-mono text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formSettings.googleSpreadsheetId && (
                <a
                  href={`https://docs.google.com/spreadsheets/d/${formSettings.googleSpreadsheetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  เปิด Sheet
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Apps Script Web App URL (สำหรับการซิงค์ข้อมูลจริง - LIVE Sync)
            </label>
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={formSettings.googleWebAppUrl || ''}
              onChange={(e) => setFormSettings({ ...formSettings, googleWebAppUrl: e.target.value.trim() })}
              className="w-full px-3.5 py-2.5 font-mono text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sync Test Control */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl">
            <div>
              <p className="text-xs font-bold text-blue-900">ทดสอบการเชื่อมต่อ &amp; ซิงค์ข้อมูลเข้า Google Sheets</p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                {lastSyncMessage || 'กดปุ่มเพื่อทดสอบส่งข้อมูลปัจจุบันไปยัง Google Sheets'}
              </p>
            </div>
            <button
              type="button"
              onClick={triggerSheetsSync}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'กำลังส่งข้อมูล...' : 'ซิงค์ข้อมูลทันที'}
            </button>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <p className="font-bold">คำแนะนำการติดตั้ง Google Apps Script:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-emerald-800">
              <li>กดปุ่ม "คัดลอกโค้ด Google Apps Script" ด้านบน</li>
              <li>เปิด Google Sheets ของโรงเรียน/หน่วยงาน แล้วไปที่ เมนู Extensions &gt; Apps Script</li>
              <li>วางโค้ดทั้งหมดลงในไฟล์ `Code.gs` แล้วกด Save</li>
              <li>กด Deploy &gt; New deployment &gt; Select type: Web app</li>
              <li>ตั้งค่า Execute as: `Me` และ Who has access: `Anyone`</li>
              <li>คัดลอก Web App URL นำมาวางลงในช่องกรอกด้านบนแล้วกด "บันทึกการตั้งค่า"</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 5. Cloudflare Worker Proxy Connection (CORS Bypass & Security) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Cloud className="w-5 h-5 text-amber-600" />
              5. การเชื่อมต่อ Cloudflare Worker Proxy (ปลดล็อก CORS &amp; รองรับ Cloudflare)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ใช้งาน Cloudflare Worker เพื่อเป็นพร็อกซีในการรับ-ส่งข้อมูลไปยัง Google Sheets ป้องกันปัญหา CORS และการบล็อกร้องขอ
            </p>
          </div>

          <button
            onClick={() => setIsCloudflareModalOpen(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Code className="w-4 h-4 text-amber-200" />
            คัดลอกโค้ด Cloudflare Worker
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl">
            <div>
              <p className="text-xs font-bold text-amber-950">เปิดใช้งาน Cloudflare Worker Proxy</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                ส่งข้อมูลผ่านเซิร์ฟเวอร์ Cloudflare เพื่อความเสถียรสูงสุด
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormSettings({ ...formSettings, cloudflareEnabled: !formSettings.cloudflareEnabled })}
              className="text-amber-600 hover:text-amber-700 transition-colors"
            >
              {formSettings.cloudflareEnabled ? (
                <ToggleRight className="w-9 h-9 text-amber-600" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-400" />
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cloudflare Worker Proxy URL
            </label>
            <input
              type="text"
              placeholder="https://satit-inventory-proxy.your-subdomain.workers.dev"
              value={formSettings.cloudflareProxyUrl || ''}
              onChange={(e) => setFormSettings({ ...formSettings, cloudflareProxyUrl: e.target.value.trim() })}
              className="w-full px-3.5 py-2.5 font-mono text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              คำแนะนำการเชื่อมต่อ Cloudflare Worker:
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              1. กดปุ่ม <span className="font-semibold text-amber-800">"คัดลอกโค้ด Cloudflare Worker"</span> ด้านบน<br />
              2. สร้าง Worker ใหม่ในระบบ <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-semibold">Cloudflare Dashboard</a> แล้ววางโค้ดลงไป<br />
              3. นำ URL ที่ได้จาก Cloudflare Worker มาวางลงในช่องด้านบนนี้แล้วกด "บันทึกการตั้งค่า"
            </p>
          </div>
        </div>
      </div>

      {/* Google Apps Script Modal */}
      <GoogleScriptModal isOpen={isScriptModalOpen} onClose={() => setIsScriptModalOpen(false)} />

      {/* Cloudflare Worker Proxy Modal */}
      <CloudflareModal isOpen={isCloudflareModalOpen} onClose={() => setIsCloudflareModalOpen(false)} />

    </div>
  );
};
