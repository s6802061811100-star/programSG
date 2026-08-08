import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { History, Search, ShieldCheck } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, language, mode } = useApp();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t.menuAuditLog} ({auditLogs.length})</h1>
          <p className="text-xs text-slate-500 mt-1">
            บันทึกประวัติการทำรายการ การอนุมัติ และการเปลี่ยนแปลงข้อมูลในระบบ (โหมดปัจจุบัน: {mode})
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="ค้นหา Log..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">วัน-เวลา</th>
                <th className="p-3">ผู้ปฏิบัติงาน</th>
                <th className="p-3">บทบาท</th>
                <th className="p-3">การกระทำ (Action)</th>
                <th className="p-3">รายละเอียด (Details)</th>
                <th className="p-3">โหมด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ไม่พบบันทึกประวัติการใช้งาน
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString('th-TH')}</td>
                    <td className="p-3 font-bold text-slate-900">{log.userName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-800">{log.action}</td>
                    <td className="p-3 text-slate-600 max-w-md truncate">{log.details}</td>
                    <td className="p-3 font-mono text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        log.mode === 'LIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.mode}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
