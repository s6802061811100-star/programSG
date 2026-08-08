import React from 'react';
import { RequisitionStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Clock, CheckCircle2, XCircle, FileEdit, RotateCcw, PackageCheck, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status: RequisitionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { language } = useApp();
  const t = translations[language];

  switch (status) {
    case 'DRAFT':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <FileEdit className="w-3 h-3 text-slate-500" />
          {t.statusDraft}
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          {t.statusPending}
        </span>
      );
    case 'RETURNED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
          <RotateCcw className="w-3 h-3 text-orange-600" />
          {t.statusReturned}
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          {t.statusApproved}
        </span>
      );
    case 'RECEIVED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
          <PackageCheck className="w-3 h-3 text-blue-600" />
          {t.statusReceived}
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
          <XCircle className="w-3 h-3 text-red-600" />
          {t.statusRejected}
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
          <Ban className="w-3 h-3 text-slate-400" />
          {t.statusCancelled}
        </span>
      );
    default:
      return null;
  }
};
