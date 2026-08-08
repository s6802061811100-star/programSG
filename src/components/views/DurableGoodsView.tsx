import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { DurableGood } from '../../types';
import { Box, Plus, Edit, Trash2, Search } from 'lucide-react';

export const DurableGoodsView: React.FC = () => {
  const { durableGoods, addDurableGood, updateDurableGood, deleteDurableGood, showConfirmDialog, language } = useApp();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGood, setEditingGood] = useState<DurableGood | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [category, setCategory] = useState('ครุภัณฑ์สำนักงาน');
  const [purchaseDate, setPurchaseDate] = useState('2025-10-01');
  const [price, setPrice] = useState(10000);
  const [departmentName, setDepartmentName] = useState('ฝ่ายบริหารทั่วไป');
  const [status, setStatus] = useState<'NORMAL' | 'REPAIR' | 'DISPOSED' | 'LOST'>('NORMAL');
  const [location, setLocation] = useState('อาคาร 1');

  const filteredGoods = durableGoods.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingGood(null);
    setCode(`สท-68-00${durableGoods.length + 1}/69`);
    setName('');
    setSerialNumber('');
    setBrandModel('');
    setCategory('ครุภัณฑ์สำนักงาน');
    setPurchaseDate('2025-10-01');
    setPrice(10000);
    setDepartmentName('ฝ่ายบริหารทั่วไป');
    setStatus('NORMAL');
    setLocation('อาคาร 1');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: DurableGood) => {
    setEditingGood(g);
    setCode(g.code);
    setName(g.name);
    setSerialNumber(g.serialNumber);
    setBrandModel(g.brandModel);
    setCategory(g.category);
    setPurchaseDate(g.purchaseDate);
    setPrice(g.price);
    setDepartmentName(g.departmentName);
    setStatus(g.status);
    setLocation(g.location);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('กรุณากรอกชื่อครุภัณฑ์');
      return;
    }

    if (editingGood) {
      updateDurableGood(editingGood.id, {
        code,
        name,
        serialNumber,
        brandModel,
        category,
        purchaseDate,
        price,
        departmentName,
        status,
        location
      });
    } else {
      addDurableGood({
        code,
        name,
        serialNumber,
        brandModel,
        category,
        purchaseDate,
        price,
        departmentId: 'DEP-001',
        departmentName,
        status,
        location
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (g: DurableGood) => {
    showConfirmDialog({
      title: t.confirmDeleteTitle,
      message: `${t.confirmDeleteMsg} ครุภัณฑ์ ${g.name} (${g.code})`,
      confirmText: t.delete,
      isDanger: true,
      onConfirm: () => deleteDurableGood(g.id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">จัดการครุภัณฑ์ ({durableGoods.length})</h1>
          <p className="text-xs text-slate-500 mt-1">ทะเบียนครุภัณฑ์ หมายเลขครุภัณฑ์ ซีเรียลนัมเบอร์ และสถานะการใช้งาน</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200"
        >
          <Plus className="w-4 h-4" />
          {t.add}ครุภัณฑ์ใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, เลขครุภัณฑ์, Serial No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">เลขทะเบียนครุภัณฑ์</th>
                <th className="p-3">ชื่อครุภัณฑ์</th>
                <th className="p-3">Serial Number</th>
                <th className="p-3">ยี่ห้อ/รุ่น</th>
                <th className="p-3">หน่วยงานที่ครอบครอง</th>
                <th className="p-3">มูลค่า (บาท)</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredGoods.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{g.code}</td>
                  <td className="p-3 font-semibold">{g.name}</td>
                  <td className="p-3 font-mono text-slate-600">{g.serialNumber}</td>
                  <td className="p-3">{g.brandModel}</td>
                  <td className="p-3">{g.departmentName}</td>
                  <td className="p-3 font-bold">{g.price.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      g.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' :
                      g.status === 'REPAIR' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button onClick={() => handleOpenEdit(g)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(g)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingGood ? 'แก้ไขข้อมูลครุภัณฑ์' : 'เพิ่มครุภัณฑ์ใหม่'}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">เลขทะเบียนครุภัณฑ์</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Serial Number</label>
                <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-slate-600 mb-1">ชื่อรายการครุภัณฑ์ *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">ยี่ห้อ / รุ่น</label>
                <input type="text" value={brandModel} onChange={(e) => setBrandModel(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">มูลค่า (บาท)</label>
                <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">หน่วยงานที่ครอบครอง</label>
                <input type="text" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">สถานะ</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold">
                  <option value="NORMAL">ปกติ (NORMAL)</option>
                  <option value="REPAIR">ส่งซ่อม (REPAIR)</option>
                  <option value="DISPOSED">จำหน่ายออก (DISPOSED)</option>
                </select>
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
