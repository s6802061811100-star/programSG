import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateCloudflareWorkerCode } from '../../services/googleSheets';
import { Cloud, Copy, Check, ExternalLink, X, ShieldCheck } from 'lucide-react';

interface CloudflareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareModal: React.FC<CloudflareModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = generateCloudflareWorkerCode(settings.googleWebAppUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl text-white">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Cloudflare Worker Proxy (CORS Bypass)</h2>
              <p className="text-xs text-amber-100">โค้ด Cloudflare Worker สำหรับเชื่อมต่อ Web App กับ Google Sheets อย่างราบรื่น</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-amber-200 hover:text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <div className="font-bold text-sm text-amber-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              ขั้นตอนการติดตั้งใน Cloudflare Workers:
            </div>
            <ol className="list-decimal list-inside space-y-1">
              <li>ล็อกอินเข้า <strong>Cloudflare Dashboard</strong> (dash.cloudflare.com)</li>
              <li>ไปที่เมนู <strong>Workers &amp; Pages</strong> → กดปุ่ม <strong>Create Application</strong> → <strong>Create Worker</strong></li>
              <li>ตั้งชื่อ Worker เช่น <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">satit-inventory-proxy</code> แล้วกด <strong>Deploy</strong></li>
              <li>กด <strong>Edit code</strong> นำโค้ดด้านล่างนี้ไปวางแทนที่ทั้งหมดในตัวแก้ไข</li>
              <li>กด <strong>Save and Deploy</strong> แล้วคัดลอก URL ของ Worker ที่ได้ (เช่น <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">https://satit-inventory-proxy.subdomain.workers.dev</code>)</li>
              <li>นำ URL มาวางในช่อง <strong>Cloudflare Worker Proxy URL</strong> ในหน้าตั้งค่าระบบของแอปนี้!</li>
            </ol>
          </div>

          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 rounded-lg shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'คัดลอกโค้ดแล้ว!' : 'คัดลอกโค้ด Cloudflare Worker'}
            </button>
            <pre className="bg-slate-950 text-slate-100 text-xs p-4 rounded-xl font-mono overflow-x-auto max-h-[350px] leading-relaxed border border-slate-800">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            เปิด Cloudflare Dashboard (dash.cloudflare.com)
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
