import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  ClipboardList, Clock, CheckCircle2, PackageCheck, AlertTriangle, 
  Coins, TrendingUp, ShieldAlert, FileText 
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const DashboardView: React.FC = () => {
  const { requisitions, materials, departments, user, language, mode } = useApp();
  const t = translations[language];

  // Anonymize requester details for EXECUTIVE role (Rule #2 for EXECUTIVE)
  const isExecutive = user.role === 'EXECUTIVE';

  // Stats calculation
  const totalRequests = requisitions.length;
  const pendingRequests = requisitions.filter(r => r.status === 'PENDING').length;
  const approvedRequests = requisitions.filter(r => r.status === 'APPROVED').length;
  const receivedRequests = requisitions.filter(r => r.status === 'RECEIVED').length;
  const lowStockMaterials = materials.filter(m => m.stockQty <= m.minQty);

  // Department Budget Usage data for charts
  const deptBudgetData = departments.map(d => ({
    name: d.name,
    allocated: d.budgetAllocated,
    used: d.budgetUsed,
    remaining: Math.max(0, d.budgetAllocated - d.budgetUsed)
  }));

  // Requisition Status Breakdown for Pie Chart
  const statusPieData = [
    { name: t.statusPending, value: pendingRequests, color: '#f59e0b' },
    { name: t.statusApproved, value: approvedRequests, color: '#0284c7' },
    { name: t.statusReceived, value: receivedRequests, color: '#10b981' },
    { name: t.statusDraft, value: requisitions.filter(r => r.status === 'DRAFT').length, color: '#64748b' },
    { name: t.statusRejected, value: requisitions.filter(r => r.status === 'REJECTED').length, color: '#f43f5e' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      
      {/* Executive Privacy Anonymization Banner */}
      {isExecutive && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{t.executivePrivacyNotice}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-lg">
              <Clock className="w-5 h-5" />
            </span>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
              {pendingRequests} รายการ
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingRequests}</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">{t.statusPending}</div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="p-2 bg-orange-50 text-orange-600 rounded-lg text-lg">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <span className="text-[10px] text-red-500 font-bold bg-rose-50 px-2 py-0.5 rounded">
              {lowStockMaterials.length} Critical
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{lowStockMaterials.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">วัสดุคงคลังเหลือน้อย (Low Stock)</div>
        </div>

        {/* Approved Requests */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-lg">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{approvedRequests}</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">อนุมัติแล้ว (Approved)</div>
        </div>

        {/* Total Requisitions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg text-lg">
              <ClipboardList className="w-5 h-5" />
            </span>
            <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded">
              Mode: {mode}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalRequests}</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">คำขอทั้งหมด (Total Requests)</div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Budget Usage Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <span className="w-2 h-4 bg-blue-600 rounded-full"></span>
              สรุปการใช้งบประมาณจำแนกตามหน่วยงาน (บาท)
            </h2>
            <span className="text-xs text-slate-400 font-medium">ปีงบประมาณ 2569</span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptBudgetData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: any) => [`${Number(value).toLocaleString()} บาท`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="allocated" name="งบจัดสรร" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" name="เบิกใช้ไปแล้ว" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requisition Status Distribution Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-700 flex items-center gap-2 mb-3">
              <span className="w-2 h-4 bg-amber-500 rounded-full"></span>
              สัดส่วนสถานะการเบิกพัสดุ
            </h2>
            
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs">
            {statusPieData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value} รายการ</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Requisitions Table & Quick Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Requisitions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <span className="w-2 h-4 bg-blue-600 rounded-full"></span>
              คำขอเบิกล่าสุด / Recent Requisitions
            </h2>
            <span className="text-[11px] font-bold text-blue-600">5 รายการล่าสุด</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">ผู้เบิก (User)</th>
                  <th className="px-4 py-3">แผนก (Department)</th>
                  <th className="px-4 py-3">มูลค่า (Total)</th>
                  <th className="px-4 py-3">สถานะ (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {requisitions.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{req.docNo}</td>
                    <td className="px-4 py-3 font-medium">
                      {isExecutive ? '*** (Anonymized)' : req.requesterName}
                    </td>
                    <td className="px-4 py-3">{req.departmentName}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{req.totalAmount.toLocaleString()} ฿</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Stack: Low Stock Alert & Dark Quick Access Banner */}
        <div className="flex flex-col gap-6">
          
          {/* Low Stock Warnings */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-1">
            <h3 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-4 bg-amber-500 rounded-full"></span>
              รายการพัสดุต่ำกว่าเกณฑ์
            </h3>

            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {lowStockMaterials.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">ไม่มีพัสดุต่ำกว่าเกณฑ์ขั้นต่ำ</p>
              ) : (
                lowStockMaterials.map((mat) => (
                  <div key={mat.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-800">{mat.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{mat.code}</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 font-bold text-[11px] rounded">
                        คงเหลือ {mat.stockQty} {mat.unit}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Access Action Card */}
          <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/20 rounded-full pointer-events-none"></div>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
              Quick Action
            </h3>
            <p className="text-base font-medium mb-3 text-slate-100">
              ออกรายงานและวิเคราะห์งบประมาณประจำเดือน
            </p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              ดาวน์โหลดรายงาน PDF / Excel
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
