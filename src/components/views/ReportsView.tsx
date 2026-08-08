import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid 
} from 'recharts';
import { BarChart3, Download, Printer, ShieldAlert, FileSpreadsheet } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { requisitions, materials, departments, user, language } = useApp();
  const t = translations[language];

  const [reportType, setReportType] = useState<'monthly' | 'department' | 'stock'>('monthly');

  const isExecutive = user.role === 'EXECUTIVE';

  // Report Data: Monthly requisition count and amount
  const monthlyData = [
    { month: 'ม.ค.', requests: 12, totalAmount: 45000 },
    { month: 'ก.พ.', requests: 18, totalAmount: 68000 },
    { month: 'มี.ค.', requests: 15, totalAmount: 52000 },
    { month: 'เม.ย.', requests: 9, totalAmount: 31000 },
    { month: 'พ.ค.', requests: 22, totalAmount: 89000 },
    { month: 'มิ.ย.', requests: 25, totalAmount: 94000 },
  ];

  // Report Data: Department budget usage comparison
  const deptData = departments.map(d => ({
    name: d.name,
    budget: d.budgetAllocated,
    used: d.budgetUsed
  }));

  // CSV Export Function
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    if (reportType === 'monthly') {
      csvContent += "เดือน,จำนวนคำขอ,มูลค่าการเบิกรวม (บาท)\n";
      monthlyData.forEach(row => {
        csvContent += `${row.month},${row.requests},${row.totalAmount}\n`;
      });
    } else if (reportType === 'department') {
      csvContent += "หน่วยงาน/แผนก,งบจัดสรร (บาท),งบใช้ไป (บาท)\n";
      deptData.forEach(row => {
        csvContent += `${row.name},${row.budget},${row.used}\n`;
      });
    } else {
      csvContent += "รหัสพัสดุ,ชื่อรายการ,หมวดหมู่,คงเหลือ,ขั้นต่ำ,ราคาต่อหน่วย (บาท)\n";
      materials.forEach(m => {
        csvContent += `${m.code},${m.name},${m.category},${m.stockQty},${m.minQty},${m.unitPrice}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">รายงานสถิติและสรุปภาพรวมการเบิก-จ่ายพัสดุ</h1>
          <p className="text-xs text-slate-500 mt-1">วิเคราะห์แนวโน้มการใช้งานพัสดุ การใช้งบประมาณรายหน่วยงาน และยอดคงคลัง</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200"
          >
            <Download className="w-4 h-4" />
            ส่งออก CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-slate-200"
          >
            <Printer className="w-4 h-4" />
            พิมพ์รายงาน
          </button>
        </div>
      </div>

      {/* Executive Anonymization Warning */}
      {isExecutive && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-800 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-sky-600 shrink-0" />
          <span>{t.executivePrivacyNotice}</span>
        </div>
      )}

      {/* Report Type Subtabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit gap-1">
        <button
          onClick={() => setReportType('monthly')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            reportType === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          รายงานแนวโน้มรายเดือน
        </button>
        <button
          onClick={() => setReportType('department')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            reportType === 'department' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          รายงานรายหน่วยงาน
        </button>
        <button
          onClick={() => setReportType('stock')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            reportType === 'stock' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          รายงานพัสดุคงคลัง
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-800 text-sm mb-4">
          {reportType === 'monthly' ? 'กราฟแสดงมูลค่าการเบิกพัสดุรายเดือน (บาท)' :
           reportType === 'department' ? 'เปรียบเทียบการใช้งบประมาณรายหน่วยงาน (บาท)' :
           'รายงานสรุปสถานะคลังพัสดุ'}
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {reportType === 'monthly' ? (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="totalAmount" name="มูลค่าการเบิกรวม (บาท)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            ) : (
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="budget" name="งบประมาณจัดสรร" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                <Bar dataKey="used" name="เบิกใช้ไปแล้ว" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-xs">
          ตารางรายละเอียดข้อมูลรายงาน
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {reportType === 'stock' ? (
              <>
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">รหัสพัสดุ</th>
                    <th className="p-3">รายการ</th>
                    <th className="p-3">หมวดหมู่</th>
                    <th className="p-3 text-center">คงเหลือ</th>
                    <th className="p-3 text-right">ราคา/หน่วย</th>
                    <th className="p-3 text-right">มูลค่ารวม (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {materials.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{m.code}</td>
                      <td className="p-3 font-semibold">{m.name}</td>
                      <td className="p-3">{m.category}</td>
                      <td className="p-3 text-center font-bold">{m.stockQty} {m.unit}</td>
                      <td className="p-3 text-right">{m.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-extrabold text-slate-900">{(m.stockQty * m.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">{reportType === 'monthly' ? 'เดือน' : 'หน่วยงาน'}</th>
                    <th className="p-3 text-right">{reportType === 'monthly' ? 'จำนวนคำขอ' : 'งบประมาณจัดสรร (บาท)'}</th>
                    <th className="p-3 text-right">{reportType === 'monthly' ? 'มูลค่ารวม (บาท)' : 'งบใช้ไปแล้ว (บาท)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reportType === 'monthly' ? monthlyData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold">{row.month}</td>
                      <td className="p-3 text-right">{row.requests} รายการ</td>
                      <td className="p-3 text-right font-bold text-emerald-700">{row.totalAmount.toLocaleString()} บาท</td>
                    </tr>
                  )) : deptData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold">{row.name}</td>
                      <td className="p-3 text-right font-semibold">{row.budget.toLocaleString()} บาท</td>
                      <td className="p-3 text-right font-bold text-emerald-700">{row.used.toLocaleString()} บาท</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>

    </div>
  );
};
