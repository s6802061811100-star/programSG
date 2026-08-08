import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Material, RequisitionItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Search, Plus, Trash2, Send, Save, Ban, Eye, 
  ShoppingCart, Package, AlertCircle, FileText, ClipboardList 
} from 'lucide-react';

export const RequisitionView: React.FC = () => {
  const { 
    materials, requisitions, user, createRequisition, 
    cancelRequisition, showConfirmDialog, language 
  } = useApp();
  const t = translations[language];

  const [activeSubTab, setActiveSubTab] = useState<'create' | 'history'>('create');
  
  // Requisition Form State
  const [requesterName, setRequesterName] = useState(user.name);
  const [departmentName, setDepartmentName] = useState(user.departmentName);
  const [reason, setReason] = useState('');
  const [cartItems, setCartItems] = useState<RequisitionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State for Viewing Request Detail
  const [selectedReq, setSelectedReq] = useState<any>(null);

  // Filter materials by search and category
  const categories = Array.from(new Set(materials.map(m => m.category)));
  const filteredMaterials = materials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        m.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Add Item to Requisition Cart
  const handleAddToCart = (material: Material) => {
    const existing = cartItems.find(i => i.materialId === material.id);
    if (existing) {
      if (existing.requestedQty >= material.stockQty) {
        alert(`จำนวนขอเบิกเกินจำนวนคงเหลือในคลัง (${material.stockQty} ${material.unit})`);
        return;
      }
      setCartItems(cartItems.map(i => i.materialId === material.id ? {
        ...i,
        requestedQty: i.requestedQty + 1,
        totalPrice: (i.requestedQty + 1) * i.unitPrice
      } : i));
    } else {
      if (material.stockQty <= 0) {
        alert('พัสดุรายการนี้หมดคลัง ไม่สามารถขอเบิกได้');
        return;
      }
      setCartItems([...cartItems, {
        materialId: material.id,
        materialCode: material.code,
        materialName: material.name,
        unit: material.unit,
        unitPrice: material.unitPrice,
        requestedQty: 1,
        totalPrice: material.unitPrice
      }]);
    }
  };

  // Update Cart Quantity
  const handleUpdateCartQty = (materialId: string, qty: number) => {
    const mat = materials.find(m => m.id === materialId);
    if (!mat) return;
    if (qty > mat.stockQty) {
      alert(`จำนวนขอเบิกเกินจำนวนคงเหลือในคลัง (${mat.stockQty} ${mat.unit})`);
      return;
    }
    if (qty <= 0) {
      setCartItems(cartItems.filter(i => i.materialId !== materialId));
      return;
    }
    setCartItems(cartItems.map(i => i.materialId === materialId ? {
      ...i,
      requestedQty: qty,
      totalPrice: qty * i.unitPrice
    } : i));
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (materialId: string) => {
    setCartItems(cartItems.filter(i => i.materialId !== materialId));
  };

  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Submit Requisition Request
  const handleSubmitRequisition = (isDraft = false) => {
    if (cartItems.length === 0) {
      alert('กรุณาเลือกรายการพัสดุอย่างน้อย 1 รายการ');
      return;
    }
    if (!reason.trim() && !isDraft) {
      alert('กรุณาระบุเหตุผลในการขอเบิกพัสดุ');
      return;
    }

    createRequisition({
      requesterId: user.id,
      requesterName,
      departmentId: user.departmentId,
      departmentName,
      requesterPosition: user.position,
      reason: reason || 'ขอเบิกพัสดุตามภาระงาน',
      items: cartItems,
      totalAmount: totalCartAmount,
      fiscalYear: '2569',
      academicYear: '2568',
      semester: '1'
    }, isDraft);

    // Reset Form
    setCartItems([]);
    setReason('');
    setActiveSubTab('history');
  };

  // Cancel Request Handler with Confirmation Modal (Rule #8)
  const handleCancelRequest = (reqId: string, docNo: string) => {
    showConfirmDialog({
      title: t.confirmCancelReqTitle,
      message: `${t.confirmCancelReqMsg} ${docNo} หรือไม่?`,
      confirmText: 'ยกเลิกคำขอเบิก',
      isDanger: true,
      onConfirm: () => cancelRequisition(reqId)
    });
  };

  // User's own requisitions
  const userRequisitions = requisitions.filter(r => r.requesterId === user.id || user.role === 'ADMIN');

  return (
    <div className="space-y-6">
      
      {/* Top Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ระบบเบิก-จ่ายพัสดุ (ผู้รับบริการ)</h1>
          <p className="text-xs text-slate-500 mt-1">
            ค้นหารายการพัสดุ สร้างคำขอเบิก และติดตามสถานะเอกสาร
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'create' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-1.5" />
            {t.menuRequisition}
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4 inline mr-1.5" />
            {t.menuMyRequisitions} ({userRequisitions.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Material Catalog Picker */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Search & Category Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อพัสดุ หรือรหัสพัสดุ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">ทุกหมวดหมู่พัสดุ</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Material Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMaterials.map((mat) => (
                <div 
                  key={mat.id} 
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                        {mat.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        mat.stockQty <= mat.minQty ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        คงเหลือ {mat.stockQty} {mat.unit}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 text-xs mt-2 line-clamp-2">{mat.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{mat.category} | {mat.location}</p>
                    <p className="text-xs font-extrabold text-slate-900 mt-2">
                      {mat.unitPrice.toLocaleString()} บาท / {mat.unit}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(mat)}
                    disabled={mat.stockQty <= 0}
                    className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      mat.stockQty <= 0 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่มลงตะกร้าขอเบิก
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Requisition Request Form & Selected Cart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                ใบขอเบิกพัสดุ (Requisition Form)
              </h3>

              {/* Requester Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.requesterName}</label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.department}</label>
                  <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.reason} *</label>
                  <textarea
                    rows={2}
                    placeholder="ระบุวัตถุประสงค์ในการขอเบิก..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Selected Items Cart List */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">รายการพัสดุที่เลือก ({cartItems.length})</span>
                  <span className="text-xs font-extrabold text-slate-900">{totalCartAmount.toLocaleString()} บาท</span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                    ยังไม่มีรายการพัสดุในตะกร้า
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.materialId} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between gap-2">
                        <div className="flex-1 truncate">
                          <div className="font-bold text-slate-800 truncate">{item.materialName}</div>
                          <div className="text-[10px] text-slate-500">{item.unitPrice} บาท / {item.unit}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.requestedQty}
                            onChange={(e) => handleUpdateCartQty(item.materialId, parseInt(e.target.value) || 0)}
                            className="w-14 px-2 py-1 text-center font-bold border border-slate-300 rounded-lg bg-white"
                          />
                          <button
                            onClick={() => handleRemoveFromCart(item.materialId)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleSubmitRequisition(true)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                {t.saveDraft}
              </button>
              <button
                onClick={() => handleSubmitRequisition(false)}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200 transition-colors"
              >
                <Send className="w-4 h-4" />
                {t.submit}
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Requisition History & Status Tracking Table */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">{t.docNo}</th>
                  <th className="p-3">{t.createdAt}</th>
                  <th className="p-3">{t.reason}</th>
                  <th className="p-3">{t.itemCount}</th>
                  <th className="p-3">{t.totalAmount}</th>
                  <th className="p-3">สถานะ</th>
                  <th className="p-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {userRequisitions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      ยังไม่มีประวัติการขอเบิกพัสดุ
                    </td>
                  </tr>
                ) : (
                  userRequisitions.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{req.docNo}</td>
                      <td className="p-3">{new Date(req.createdAt).toLocaleDateString('th-TH')}</td>
                      <td className="p-3 truncate max-w-xs">{req.reason}</td>
                      <td className="p-3">{req.items.length} รายการ</td>
                      <td className="p-3 font-bold text-slate-900">{req.totalAmount.toLocaleString()} บาท</td>
                      <td className="p-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {t.viewDetails}
                        </button>

                        {(req.status === 'PENDING' || req.status === 'DRAFT') && (
                          <button
                            onClick={() => handleCancelRequest(req.id, req.docNo)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            {t.cancel}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal View Details */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">รายละเอียดคำขอเบิก {selectedReq.docNo}</h3>
                <p className="text-xs text-slate-400 mt-0.5">วันที่ขอเบิก: {new Date(selectedReq.createdAt).toLocaleString('th-TH')}</p>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-semibold">ผู้ขอเบิก:</span>
                  <span className="font-bold text-slate-900">{selectedReq.requesterName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">สังกัด/แผนก:</span>
                  <span className="font-bold text-slate-900">{selectedReq.departmentName}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-semibold">เหตุผลในการขอเบิก:</span>
                  <span className="text-slate-800">{selectedReq.reason}</span>
                </div>
              </div>

              {selectedReq.approvalComment && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <span className="font-bold">ข้อคิดเห็นจากผู้อนุมัติ:</span> {selectedReq.approvalComment}
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-800 mb-2">รายการพัสดุ</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2.5">รหัสพัสดุ</th>
                        <th className="p-2.5">รายการ</th>
                        <th className="p-2.5 text-center">ขอเบิก</th>
                        <th className="p-2.5 text-center">อนุมัติ</th>
                        <th className="p-2.5 text-right">ราคารวม</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedReq.items.map((item: any) => (
                        <tr key={item.materialId}>
                          <td className="p-2.5 font-mono font-bold text-slate-800">{item.materialCode}</td>
                          <td className="p-2.5 font-medium">{item.materialName}</td>
                          <td className="p-2.5 text-center">{item.requestedQty} {item.unit}</td>
                          <td className="p-2.5 text-center font-bold text-emerald-700">
                            {item.approvedQty !== undefined ? item.approvedQty : item.requestedQty} {item.unit}
                          </td>
                          <td className="p-2.5 text-right font-bold">{item.totalPrice.toLocaleString()} บาท</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
