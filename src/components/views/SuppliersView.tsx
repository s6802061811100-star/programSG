import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Vendor } from '../../types';
import { Truck, Plus, Edit, Trash2, Search } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor, showConfirmDialog, language } = useApp();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.taxId.includes(searchQuery)
  );

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setCode(`VEN-00${vendors.length + 1}`);
    setName('');
    setTaxId('');
    setContactPerson('');
    setPhone('');
    setAddress('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setCode(v.code);
    setName(v.name);
    setTaxId(v.taxId);
    setContactPerson(v.contactPerson);
    setPhone(v.phone);
    setAddress(v.address);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('กรุณากรอกชื่อผู้จำหน่าย / ร้านค้า');
      return;
    }

    if (editingVendor) {
      updateVendor(editingVendor.id, {
        code,
        name,
        taxId,
        contactPerson,
        phone,
        address
      });
    } else {
      addVendor({
        code,
        name,
        taxId,
        contactPerson,
        phone,
        address,
        active: true
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (v: Vendor) => {
    showConfirmDialog({
      title: t.confirmDeleteTitle,
      message: `${t.confirmDeleteMsg} ร้านค้า ${v.name}`,
      confirmText: t.delete,
      isDanger: true,
      onConfirm: () => deleteVendor(v.id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">จัดการผู้จำหน่าย / ร้านค้า ({vendors.length})</h1>
          <p className="text-xs text-slate-500 mt-1">รายชื่อผู้ขาย เลขประจำตัวผู้เสียภาษี และข้อมูลติดต่อ</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200"
        >
          <Plus className="w-4 h-4" />
          {t.add}ผู้จำหน่ายใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ค้นหาชื่อร้านค้า หรือ เลขภาษี..."
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
                <th className="p-3">รหัสร้านค้า</th>
                <th className="p-3">ชื่อผู้จำหน่าย/บริษัท</th>
                <th className="p-3">เลขประจำตัวผู้เสียภาษี</th>
                <th className="p-3">ผู้ติดต่อ</th>
                <th className="p-3">เบอร์โทรศัพท์</th>
                <th className="p-3 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredVendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{v.code}</td>
                  <td className="p-3 font-semibold">{v.name}</td>
                  <td className="p-3 font-mono text-slate-600">{v.taxId}</td>
                  <td className="p-3">{v.contactPerson}</td>
                  <td className="p-3">{v.phone}</td>
                  <td className="p-3 text-right space-x-1">
                    <button onClick={() => handleOpenEdit(v)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(v)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
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
              {editingVendor ? 'แก้ไขข้อมูลผู้จำหน่าย' : 'เพิ่มผู้จำหน่ายใหม่'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">ชื่อบริษัท / ร้านค้า *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                  <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">ผู้ติดต่อ</label>
                  <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">เบอร์โทรศัพท์</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">ที่อยู่</label>
                <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
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
