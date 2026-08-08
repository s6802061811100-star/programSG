import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Department } from '../../types';
import { Building, Plus, Edit, Trash2 } from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment, showConfirmDialog, language } = useApp();
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [headName, setHeadName] = useState('');
  const [budgetAllocated, setBudgetAllocated] = useState(100000);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setCode(`DEP-00${departments.length + 1}`);
    setName('');
    setNameEn('');
    setHeadName('');
    setBudgetAllocated(100000);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Department) => {
    setEditingDept(d);
    setCode(d.code);
    setName(d.name);
    setNameEn(d.nameEn);
    setHeadName(d.headName);
    setBudgetAllocated(d.budgetAllocated);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('กรุณากรอกชื่อหน่วยงาน');
      return;
    }

    if (editingDept) {
      updateDepartment(editingDept.id, {
        code,
        name,
        nameEn,
        headName,
        budgetAllocated
      });
    } else {
      addDepartment({
        code,
        name,
        nameEn,
        headName,
        budgetAllocated,
        active: true
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (d: Department) => {
    showConfirmDialog({
      title: t.confirmDeleteTitle,
      message: `${t.confirmDeleteMsg} หน่วยงาน ${d.name}`,
      confirmText: t.delete,
      isDanger: true,
      onConfirm: () => deleteDepartment(d.id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">จัดการหน่วยงาน / แผนกวิชา ({departments.length})</h1>
          <p className="text-xs text-slate-500 mt-1">รายชื่อแผนกวิชา หัวหน้าหน่วยงาน และวงเงินงบประมาณจัดสรร</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200"
        >
          <Plus className="w-4 h-4" />
          {t.add}หน่วยงานใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">รหัสหน่วยงาน</th>
              <th className="p-3">ชื่อหน่วยงาน (TH)</th>
              <th className="p-3">ชื่อหน่วยงาน (EN)</th>
              <th className="p-3">หัวหน้าหน่วยงาน</th>
              <th className="p-3">งบจัดสรร (บาท)</th>
              <th className="p-3">ใช้ไปแล้ว (บาท)</th>
              <th className="p-3 text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {departments.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">{d.code}</td>
                <td className="p-3 font-semibold">{d.name}</td>
                <td className="p-3 text-slate-500">{d.nameEn}</td>
                <td className="p-3 font-medium">{d.headName}</td>
                <td className="p-3 font-bold text-slate-900">{d.budgetAllocated.toLocaleString()}</td>
                <td className="p-3 font-bold text-emerald-700">{d.budgetUsed.toLocaleString()}</td>
                <td className="p-3 text-right space-x-1">
                  <button onClick={() => handleOpenEdit(d)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(d)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
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
              {editingDept ? 'แก้ไขข้อมูลหน่วยงาน' : 'เพิ่มหน่วยงานใหม่'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">รหัสหน่วยงาน</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">ชื่อหน่วยงาน (ภาษาไทย) *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">ชื่อหน่วยงาน (ภาษาอังกฤษ)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">ชื่อหัวหน้าหน่วยงาน</label>
                <input
                  type="text"
                  value={headName}
                  onChange={(e) => setHeadName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">งบประมาณจัดสรร (บาท)</label>
                <input
                  type="number"
                  value={budgetAllocated}
                  onChange={(e) => setBudgetAllocated(parseFloat(e.target.value) || 0)}
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
