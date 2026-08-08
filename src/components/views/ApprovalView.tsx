import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Requisition } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, XCircle, RotateCcw, Eye, Coins, 
  CheckSquare, MessageSquare, AlertCircle 
} from 'lucide-react';

export const ApprovalView: React.FC = () => {
  const { 
    requisitions, user, approveRequisition, rejectRequisition, 
    sendBackRequisition, showConfirmDialog, language 
  } = useApp();
  const t = translations[language];

  const [selectedReq, setSelectedReq] = useState<Requisition | null>(null);
  const [comment, setComment] = useState('');
  const [approvedQtys, setApprovedQtys] = useState<Record<string, number>>({});

  // Filter pending requisitions for the department
  const pendingRequisitions = requisitions.filter(r => r.status === 'PENDING' && (r.departmentId === user.departmentId || user.role === 'ADMIN'));
  const processedRequisitions = requisitions.filter(r => r.status !== 'PENDING' && (r.departmentId === user.departmentId || user.role === 'ADMIN'));

  const handleOpenDetailModal = (req: Requisition) => {
    setSelectedReq(req);
    setComment('');
    // Initial approved quantities equal requested quantities
    const initialQtys: Record<string, number> = {};
    req.items.forEach(i => { initialQtys[i.materialId] = i.requestedQty; });
    setApprovedQtys(initialQtys);
  };

  const handleApprove = () => {
    if (!selectedReq) return;
    showConfirmDialog({
      title: t.confirmApproveTitle,
      message: `${t.confirmApproveMsg} ${selectedReq.docNo} หรือไม่?`,
      confirmText: t.approve,
      onConfirm: () => {
        approveRequisition(selectedReq.id, comment || 'อนุมัติคำขอเบิกเรียบร้อย', approvedQtys);
        setSelectedReq(null);
      }
    });
  };

  const handleReject = () => {
    if (!selectedReq) return;
    if (!comment.trim()) {
      alert('กรุณาระบุเหตุผลในการไม่อนุมัติคำขอ');
      return;
    }
    showConfirmDialog({
      title: t.confirmRejectTitle,
      message: `${t.confirmRejectMsg} ${selectedReq.docNo} หรือไม่?`,
      confirmText: t.reject,
      isDanger: true,
      onConfirm: () => {
        rejectRequisition(selectedReq.id, comment);
        setSelectedReq(null);
      }
    });
  };

  const handleSendBack = () => {
    if (!selectedReq) return;
    if (!comment.trim()) {
      alert('กรุณาระบุข้อคิดเห็นเพื่อให้ผู้ขอแก้ไข');
      return;
    }
    showConfirmDialog({
      title: 'ยืนยันการส่งกลับแก้ไข',
      message: `ต้องการส่งกลับคำขอเบิก ${selectedReq.docNo} ให้ผู้ขอแก้ไขหรือไม่?`,
      confirmText: t.sendBack,
      onConfirm: () => {
        sendBackRequisition(selectedReq.id, comment);
        setSelectedReq(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">ศูนย์อนุมัติคำขอเบิกพัสดุ (Approver Portal)</h1>
        <p className="text-xs text-slate-500 mt-1">
          ตรวจสอบ อนุมัติ ปฏิเสธ หรือส่งกลับแก้ไขคำขอเบิกพัสดุสำหรับหน่วยงาน {user.departmentName}
        </p>
      </div>

      {/* Pending Approvals List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-amber-600" />
          รายการคำขอเบิกพัสดุรออนุมัติ ({pendingRequisitions.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">{t.docNo}</th>
                <th className="p-3">{t.createdAt}</th>
                <th className="p-3">{t.requesterName}</th>
                <th className="p-3">{t.reason}</th>
                <th className="p-3">{t.totalAmount}</th>
                <th className="p-3 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pendingRequisitions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ไม่มีคำขอเบิกพัสดุรอการอนุมัติในขณะนี้
                  </td>
                </tr>
              ) : (
                pendingRequisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-amber-900">{req.docNo}</td>
                    <td className="p-3">{new Date(req.createdAt).toLocaleDateString('th-TH')}</td>
                    <td className="p-3 font-semibold">{req.requesterName}</td>
                    <td className="p-3 truncate max-w-xs">{req.reason}</td>
                    <td className="p-3 font-bold text-slate-900">{req.totalAmount.toLocaleString()} บาท</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenDetailModal(req)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        ตรวจสอบคำขอ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Details Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">พิจารณาอนุมัติคำขอเบิก {selectedReq.docNo}</h3>
                <p className="text-xs text-slate-400 mt-0.5">ผู้ขอเบิก: {selectedReq.requesterName} ({selectedReq.departmentName})</p>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">เหตุผลในการขอเบิก:</span>
                <p className="text-slate-700">{selectedReq.reason}</p>
              </div>

              {/* Items Table with Quantity Adjustments */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">รายการพัสดุและจำนวนที่ขออนุมัติ</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2.5">รหัสพัสดุ</th>
                        <th className="p-2.5">รายการ</th>
                        <th className="p-2.5 text-center">ขอเบิก</th>
                        <th className="p-2.5 text-center">จำนวนที่จะอนุมัติ</th>
                        <th className="p-2.5 text-right">ราคารวม</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedReq.items.map((item) => (
                        <tr key={item.materialId}>
                          <td className="p-2.5 font-mono font-bold text-slate-800">{item.materialCode}</td>
                          <td className="p-2.5 font-medium">{item.materialName}</td>
                          <td className="p-2.5 text-center">{item.requestedQty} {item.unit}</td>
                          <td className="p-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max={item.requestedQty}
                              value={approvedQtys[item.materialId] ?? item.requestedQty}
                              onChange={(e) => setApprovedQtys({
                                ...approvedQtys,
                                [item.materialId]: parseInt(e.target.value) || 0
                              })}
                              className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center font-bold bg-white"
                            />
                          </td>
                          <td className="p-2.5 text-right font-bold">{item.totalPrice.toLocaleString()} บาท</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  ข้อคิดเห็น / คำอธิบายประกอบการพิจารณา
                </label>
                <textarea
                  rows={2}
                  placeholder="ระบุข้อคิดเห็นเพิ่มเติมสำหรับคำขอเบิกนี้..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

            </div>

            {/* Modal Action Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleSendBack}
                className="w-full sm:w-auto px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {t.sendBack}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-rose-200 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  {t.reject}
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t.approve}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h3 className="font-bold text-slate-800 text-sm mb-4">ประวัติการพิจารณาคำขอเบิกทั้งหมด</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">{t.docNo}</th>
                <th className="p-3">{t.requesterName}</th>
                <th className="p-3">{t.totalAmount}</th>
                <th className="p-3">ผู้อนุมัติ</th>
                <th className="p-3">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {processedRequisitions.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{req.docNo}</td>
                  <td className="p-3">{req.requesterName}</td>
                  <td className="p-3 font-bold">{req.totalAmount.toLocaleString()} บาท</td>
                  <td className="p-3">{req.approverName || '-'}</td>
                  <td className="p-3"><StatusBadge status={req.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
