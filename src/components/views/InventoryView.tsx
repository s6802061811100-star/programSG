import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Material } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Package, PackageCheck, AlertTriangle, Plus, Edit, 
  Trash2, RefreshCw, Search, Check, FileText 
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { 
    materials, requisitions, receiveRequisition, addMaterial, 
    updateMaterial, deleteMaterial, adjustStock, showConfirmDialog, language 
  } = useApp();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'stock' | 'dispatch'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal for Stock Adjustment
  const [adjustingMaterial, setAdjustingMaterial] = useState<Material | null>(null);
  const [newStockQty, setNewStockQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');

  // Modal for Add/Edit Material
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [matCode, setMatCode] = useState('');
  const [matName, setMatName] = useState('');
  const [matCategory, setMatCategory] = useState('วัสดุสำนักงาน');
  const [matUnit, setMatUnit] = useState('ชิ้น');
  const [matStock, setMatStock] = useState(0);
  const [matMin, setMatMin] = useState(10);
  const [matUnitPrice, setMatUnitPrice] = useState(0);
  const [matLocation, setMatLocation] = useState('คลังพัสดุกลาง');

  // Approved Requisitions ready for Dispatching / Receiving
  const approvedRequisitions = requisitions.filter(r => r.status === 'APPROVED');

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdjustModal = (m: Material) => {
    setAdjustingMaterial(m);
    setNewStockQty(m.stockQty);
    setAdjustReason('');
  };

  const handleSaveStockAdjust = () => {
    if (!adjustingMaterial) return;
    if (!adjustReason.trim()) {
      alert('กรุณาระบุเหตุผลในการปรับยอดพัสดุ');
      return;
    }
    adjustStock(adjustingMaterial.id, newStockQty, adjustReason);
    setAdjustingMaterial(null);
  };

  const handleOpenAddModal = () => {
    setEditingMaterial(null);
    setMatCode(`MAT-${Date.now().toString().slice(-4)}`);
    setMatName('');
    setMatCategory('วัสดุสำนักงาน');
    setMatUnit('ชิ้น');
    setMatStock(10);
    setMatMin(5);
    setMatUnitPrice(50);
    setMatLocation('คลังพัสดุกลาง');
    setIsMaterialModalOpen(true);
  };

  const handleOpenEditModal = (m: Material) => {
    setEditingMaterial(m);
    setMatCode(m.code);
    setMatName(m.name);
    setMatCategory(m.category);
    setMatUnit(m.unit);
    setMatStock(m.stockQty);
    setMatMin(m.minQty);
    setMatUnitPrice(m.unitPrice);
    setMatLocation(m.location);
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterial = () => {
    if (!matName.trim()) {
      alert('กรุณาระบุชื่อรายการพัสดุ');
      return;
    }

    if (editingMaterial) {
      updateMaterial(editingMaterial.id, {
        code: matCode,
        name: matName,
        category: matCategory,
        unit: matUnit,
        stockQty: matStock,
        minQty: matMin,
        unitPrice: matUnitPrice,
        location: matLocation
      });
    } else {
      addMaterial({
        code: matCode,
        name: matName,
        category: matCategory,
        unit: matUnit,
        stockQty: matStock,
        minQty: matMin,
        unitPrice: matUnitPrice,
        location: matLocation
      });
    }

    setIsMaterialModalOpen(false);
  };

  const handleDeleteMaterial = (m: Material) => {
    showConfirmDialog({
      title: t.confirmDeleteTitle,
      message: `${t.confirmDeleteMsg} รายการ ${m.name} (${m.code})`,
      confirmText: t.delete,
      isDanger: true,
      onConfirm: () => deleteMaterial(m.id)
    });
  };

  const handleConfirmDispatch = (reqId: string, docNo: string) => {
    showConfirmDialog({
      title: 'ยืนยันการจ่ายพัสดุและตัดสต็อก',
      message: `ยืนยันการจ่ายพัสดุสำหรับคำขอเบิกเลขที่ ${docNo} และตัดยอดสต็อกในระบบหรือไม่?`,
      confirmText: 'ยืนยันการจ่ายพัสดุ',
      onConfirm: () => receiveRequisition(reqId)
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">การจัดการคลังพัสดุและเบิก-จ่าย (Inventory Portal)</h1>
          <p className="text-xs text-slate-500 mt-1">
            ตรวจนับพัสดุ ปรับยอดสต็อก และดำเนินการจ่ายพัสดุตามคำขอที่ได้รับการอนุมัติแล้ว
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'stock' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 inline mr-1.5" />
            พัสดุคงคลัง ({materials.length})
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'dispatch' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackageCheck className="w-4 h-4 inline mr-1.5" />
            รอจ่ายพัสดุ ({approvedRequisitions.length})
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        <div className="space-y-4">
          
          {/* Action Tools */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="ค้นหาพัสดุในคลัง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.add}รายการพัสดุใหม่
            </button>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">รหัสพัสดุ</th>
                    <th className="p-3">ชื่อรายการพัสดุ</th>
                    <th className="p-3">หมวดหมู่</th>
                    <th className="p-3 text-center">คงเหลือ</th>
                    <th className="p-3 text-center">ขั้นต่ำ</th>
                    <th className="p-3">สถานที่เก็บ</th>
                    <th className="p-3 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMaterials.map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{mat.code}</td>
                      <td className="p-3 font-semibold text-slate-800">{mat.name}</td>
                      <td className="p-3">{mat.category}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-xs ${
                          mat.stockQty <= mat.minQty ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {mat.stockQty} {mat.unit}
                        </span>
                      </td>
                      <td className="p-3 text-center font-medium text-slate-500">{mat.minQty} {mat.unit}</td>
                      <td className="p-3 text-slate-600">{mat.location}</td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenAdjustModal(mat)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                          title="ปรับยอดพัสดุ"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          ปรับยอด
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(mat)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(mat)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* Dispatch Approved Requisitions Section */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600" />
            รายการที่ได้รับการอนุมัติแล้ว และพร้อมส่งมอบพัสดุ ({approvedRequisitions.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">{t.docNo}</th>
                  <th className="p-3">{t.requesterName}</th>
                  <th className="p-3">{t.department}</th>
                  <th className="p-3">{t.itemCount}</th>
                  <th className="p-3">ผู้อนุมัติ</th>
                  <th className="p-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {approvedRequisitions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      ไม่มีรายการอนุมัติที่รอส่งมอบพัสดุในขณะนี้
                    </td>
                  </tr>
                ) : (
                  approvedRequisitions.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{req.docNo}</td>
                      <td className="p-3 font-semibold">{req.requesterName}</td>
                      <td className="p-3">{req.departmentName}</td>
                      <td className="p-3">{req.items.length} รายการ</td>
                      <td className="p-3 text-slate-600">{req.approverName}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleConfirmDispatch(req.id, req.docNo)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          ยืนยันการจ่ายพัสดุ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">ปรับยอดพัสดุคงคลัง</h3>
            <p className="text-xs text-slate-500">{adjustingMaterial.name} ({adjustingMaterial.code})</p>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">จำนวนคงเหลือใหม่</label>
              <input
                type="number"
                value={newStockQty}
                onChange={(e) => setNewStockQty(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">เหตุผลในการปรับยอด *</label>
              <textarea
                rows={2}
                placeholder="ระบุเหตุผล เช่น ตรวจนับสต็อกประจำปี, พัสดุชำรุดเสียหาย..."
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAdjustingMaterial(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveStockAdjust}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-200"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Material Modal */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingMaterial ? 'แก้ไขข้อมูลพัสดุ' : 'เพิ่มรายการพัสดุใหม่'}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">รหัสพัสดุ</label>
                <input
                  type="text"
                  value={matCode}
                  onChange={(e) => setMatCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">หมวดหมู่</label>
                <input
                  type="text"
                  value={matCategory}
                  onChange={(e) => setMatCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-600 mb-1">ชื่อรายการพัสดุ *</label>
                <input
                  type="text"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">หน่วยนับ</label>
                <input
                  type="text"
                  value={matUnit}
                  onChange={(e) => setMatUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">ราคา/หน่วย (บาท)</label>
                <input
                  type="number"
                  value={matUnitPrice}
                  onChange={(e) => setMatUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">จำนวนตั้งต้น</label>
                <input
                  type="number"
                  value={matStock}
                  onChange={(e) => setMatStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">ขั้นต่ำ (Min Alert)</label>
                <input
                  type="number"
                  value={matMin}
                  onChange={(e) => setMatMin(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-600 mb-1">สถานที่จัดเก็บ</label>
                <input
                  type="text"
                  value={matLocation}
                  onChange={(e) => setMatLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsMaterialModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveMaterial}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-200"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
