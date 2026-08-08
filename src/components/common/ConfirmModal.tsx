import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { confirmDialog, hideConfirmDialog, language } = useApp();
  const t = translations[language];

  if (!confirmDialog.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${confirmDialog.isDanger ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button 
              onClick={hideConfirmDialog}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-800">
              {confirmDialog.title || t.confirmDeleteTitle}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {confirmDialog.message}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={hideConfirmDialog}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {confirmDialog.cancelText || t.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                confirmDialog.onConfirm();
                hideConfirmDialog();
              }}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all ${
                confirmDialog.isDanger 
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {confirmDialog.confirmText || t.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
