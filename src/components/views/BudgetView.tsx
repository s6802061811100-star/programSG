import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { BudgetAllocation } from '../../types';
import { Coins, Plus, Edit } from 'lucide-react';

export const BudgetView: React.FC = () => {
  const { budgets, departments, settings, addBudgetAllocation, updateBudgetAllocation, language } = useApp();
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetAllocation | null>(null);

  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [allocatedAmount, setAllocatedAmount] = useState(100000);

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setDepartmentId(departments[0]?.id || '');
    setAllocatedAmount(100000);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BudgetAllocation) => {
    setEditingBudget(b);
    setDepartmentId(b.departmentId);
    setAllocatedAmount(b.allocatedAmount);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const dept = departments.find(d => d.id === departmentId);

    if (editingBudget) {
      updateBudgetAllocation(editingBudget.id, {
        departmentId,
        departmentName: dept?.name || '',
        allocatedAmount,
        remainingAmount: allocatedAmount - editingBudget.usedAmount
      });
    } else {
      addBudgetAllocation({
        fiscalYear: settings.fiscalYear,
        departmentId,
        departmentName: dept?.name || '',
        allocatedAmount,
        usedAmount: 0,
        remainingAmount: allocatedAmount
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">จัดการจัดสรรงบประมาณ (ปีงบประมาณ {settings.fiscalYear})</h1>
          <p className="text-xs text-slate-500 mt-1">ตั้งค่างบประมาณที่ได้รับจัดสรร วงเงินใช้ไป และคงเหลือตามแผนก</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200"
        >
          <Plus className="w-4 h-4" />
          {t.add}วงเงินงบประมาณ
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">ปีงบประมาณ</th>
              <th className="p-3">หน่วยงาน/แผนก</th>
              <th className="p-3 font-bold text-slate-900">งบจัดสรร (บาท)</th>
              <th className="p-3 font-bold text-rose-700">ใช้ไปแล้ว (บาท)</th>
              <th className="p-3 font-bold text-emerald-700">คงเหลือ (บาท)</th>
              <th className="p-3 text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {budgets.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">{b.fiscalYear}</td>
                <td className="p-3 font-semibold">{b.departmentName}</td>
                <td className="p-3 font-extrabold text-slate-900">{b.allocatedAmount.toLocaleString()}</td>
                <td className="p-3 font-bold text-rose-600">{b.usedAmount.toLocaleString()}</td>
                <td className="p-3 font-bold text-emerald-600">{b.remainingAmount.toLocaleString()}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingBudget ? 'แก้ไขวงเงินงบประมาณ' : 'เพิ่มการจัดสรรงบประมาณ'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">หน่วยงาน/แผนก</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                >
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">จำนวนงบประมาณที่จัดสรร (บาท)</label>
                <input
                  type="number"
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl">
                {t.cancel}
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-200">
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
