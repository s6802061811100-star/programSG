import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Code2, Copy, Check, ExternalLink, X, FileSpreadsheet } from 'lucide-react';

interface GoogleScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleScriptModal: React.FC<GoogleScriptModalProps> = ({ isOpen, onClose }) => {
  const { getAppsScriptCode, language } = useApp();
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = getAppsScriptCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Google Apps Script Backend Code</h2>
              <p className="text-xs text-slate-300">โค้ดสำหรับนำไปวางใน Google Sheets (Extensions → Apps Script)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 space-y-2">
            <div className="font-bold text-sm text-emerald-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              ขั้นตอนการเชื่อมต่อกับ Google Sheets:
            </div>
            <ol className="list-decimal list-inside space-y-1">
              <li>เปิดไฟล์ Google Sheets ของคุณขึ้นมา</li>
              <li>ไปที่เมนู <strong>ส่วนขยาย (Extensions)</strong> → <strong>Apps Script</strong></li>
              <li>วางโค้ดสคริปต์ด้านล่างนี้ลงในไฟล์ <code className="bg-emerald-100 px-1 py-0.5 rounded">Code.gs</code></li>
              <li>กด <strong>ทำให้ใช้งานได้ (Deploy)</strong> → <strong>การทำให้ใช้งานได้ใหม่ (New deployment)</strong></li>
              <li>เลือกประเภท: <strong>เว็บแอป (Web app)</strong> | สิทธิ์ผู้เข้าถึง: <strong>ทุกคน (Anyone)</strong></li>
              <li>คัดลอก URL เว็บแอปที่ได้ นำมาวางที่เมนู <strong>ตั้งค่าระบบ (Settings)</strong> ในแอปนี้!</li>
            </ol>
          </div>

          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 rounded-lg shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ดทั้งหมด'}
            </button>
            <pre className="bg-slate-950 text-slate-100 text-xs p-4 rounded-xl font-mono overflow-x-auto max-h-[350px] leading-relaxed border border-slate-800">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://sheets.new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            สร้างไฟล์ Google Sheet ใหม่ (sheets.new)
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
