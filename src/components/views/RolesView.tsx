import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { ShieldCheck, Check, X } from 'lucide-react';

export const RolesView: React.FC = () => {
  const { language } = useApp();
  const t = translations[language];

  const permissionsMatrix = [
    {
      feature: 'เข้าใช้งานทุกเมนูและตั้งค่าระบบ',
      admin: true, requester: false, inventory: false, approver: false, executive: false
    },
    {
      feature: 'จัดการผู้ใช้งานและสิทธิ์การเข้าถึง',
      admin: true, requester: false, inventory: false, approver: false, executive: false
    },
    {
      feature: 'เปิด/ปิดโหมด Demo และจัดการข้อมูลทดลอง',
      admin: true, requester: false, inventory: false, approver: false, executive: false
    },
    {
      feature: 'ค้นหารายการพัสดุและดูจำนวนคงคลัง (Read-only)',
      admin: true, requester: true, inventory: true, approver: true, executive: true
    },
    {
      feature: 'สร้างคำขอเบิกพัสดุ บันทึกแบบร่าง แก้ไข และยกเลิกคำขอตนเอง',
      admin: true, requester: true, inventory: false, approver: false, executive: false
    },
    {
      feature: 'อนุมัติ / ไม่อนุมัติ / ส่งกลับแก้ไขคำขอเบิกของแผนก',
      admin: true, requester: false, inventory: false, approver: true, executive: false
    },
    {
      feature: 'จ่ายพัสดุ ปรับยอดคงคลัง และจัดการข้อมูลครุภัณฑ์/ผู้จำหน่าย',
      admin: true, requester: false, inventory: true, approver: false, executive: false
    },
    {
      feature: 'ดูงบประมาณหน่วยงานและสถิติภาพรวม (Anonymized Privacy)',
      admin: true, requester: false, inventory: true, approver: true, executive: true
    },
    {
      feature: 'ดู Audit Log บันทึกประวัติการใช้งานระบบ',
      admin: true, requester: false, inventory: false, approver: false, executive: false
    }
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-xl font-bold text-slate-800">สิทธิ์การใช้งานระบบ (Roles & Permissions Matrix)</h1>
        <p className="text-xs text-slate-500 mt-1">
          ตารางเปรียบเทียบสิทธิ์การเข้าถึงและการทำงานของแต่ละบทบาทในระบบ
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-bold uppercase">
              <tr>
                <th className="p-4 w-1/3">รายการสิทธิ์/การทำงาน</th>
                <th className="p-4 text-center">ADMIN</th>
                <th className="p-4 text-center">REQUESTER</th>
                <th className="p-4 text-center">APPROVER</th>
                <th className="p-4 text-center">INVENTORY</th>
                <th className="p-4 text-center">EXECUTIVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="p-3.5 font-bold text-slate-800">{row.feature}</td>
                  <td className="p-3.5 text-center">
                    {row.admin ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.requester ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.approver ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.inventory ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.executive ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
