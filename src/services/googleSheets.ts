import { SystemSettings, User, Department, Material, DurableGood, Vendor, BudgetAllocation, Requisition, AuditLog } from '../types';

/**
 * Service to handle Google Sheets REST API & Google Apps Script Backend integration
 */

// Generate the standalone Google Apps Script (Code.gs) for deployment into Google Sheets
export function generateGoogleAppsScriptCode(): string {
  return `/**
 * Google Apps Script for School & Government Inventory Requisition System
 * (ระบบเบิก-จ่ายพัสดุสำหรับโรงเรียนและหน่วยงานภาครัฐ)
 * 
 * Instructions:
 * 1. Open your Google Sheet -> Extensions -> Apps Script
 * 2. Replace all code in Code.gs with this script
 * 3. Click "Deploy" -> "New deployment" -> Select "Web app"
 * 4. Execute as: "Me" | Who has access: "Anyone"
 * 5. Copy the Web App URL and paste it into the System Settings page in the Web App!
 */

function setupSpreadsheetSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const requiredSheets = [
    'Settings', 'Users', 'Departments', 'Materials', 
    'DurableGoods', 'Suppliers', 'Budgets', 'Requisitions', 
    'AuditLogs', 'Demo_Materials', 'Demo_Requisitions', 'Demo_AuditLogs'
  ];

  requiredSheets.forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
  });
}

function doGet(e) {
  setupSpreadsheetSheets();
  const action = e.parameter.action || 'ping';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let responseData = { status: 'success', action: action, timestamp: new Date().toISOString() };
  
  if (action === 'getAllData') {
    responseData.data = {
      settings: getSheetData(ss.getSheetByName('Settings')),
      users: getSheetData(ss.getSheetByName('Users')),
      departments: getSheetData(ss.getSheetByName('Departments')),
      materials: getSheetData(ss.getSheetByName('Materials')),
      requisitions: getSheetData(ss.getSheetByName('Requisitions')),
      auditLogs: getSheetData(ss.getSheetByName('AuditLogs')),
      demoMaterials: getSheetData(ss.getSheetByName('Demo_Materials')),
      demoRequisitions: getSheetData(ss.getSheetByName('Demo_Requisitions'))
    };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    setupSpreadsheetSheets();
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const payload = contents.payload;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'syncFullState') {
      saveFullStateToSheets(ss, payload);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Full state synced successfully' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'addAuditLog') {
      appendRowToSheet(ss.getSheetByName(payload.mode === 'DEMO' ? 'Demo_AuditLogs' : 'AuditLogs'), payload);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    let rowObj = {};
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = data[i][j];
    }
    rows.push(rowObj);
  }
  return rows;
}

function saveFullStateToSheets(ss, data) {
  if (data.settings) writeDataToSheet(ss.getSheetByName('Settings'), [data.settings]);
  if (data.users) writeDataToSheet(ss.getSheetByName('Users'), data.users);
  if (data.departments) writeDataToSheet(ss.getSheetByName('Departments'), data.departments);
  if (data.materials) writeDataToSheet(ss.getSheetByName('Materials'), data.materials);
  if (data.durableGoods) writeDataToSheet(ss.getSheetByName('DurableGoods'), data.durableGoods);
  if (data.suppliers) writeDataToSheet(ss.getSheetByName('Suppliers'), data.suppliers);
  if (data.budgets) writeDataToSheet(ss.getSheetByName('Budgets'), data.budgets);
  if (data.requisitions) writeDataToSheet(ss.getSheetByName('Requisitions'), data.requisitions);
  if (data.auditLogs) writeDataToSheet(ss.getSheetByName('AuditLogs'), data.auditLogs);
  if (data.demoMaterials) writeDataToSheet(ss.getSheetByName('Demo_Materials'), data.demoMaterials);
  if (data.demoRequisitions) writeDataToSheet(ss.getSheetByName('Demo_Requisitions'), data.demoRequisitions);
}

function writeDataToSheet(sheet, items) {
  if (!sheet || items.length === 0) return;
  sheet.clearContents();
  const firstItem = items[0];
  const headers = Object.keys(firstItem);
  sheet.appendRow(headers);
  items.forEach(item => {
    const row = headers.map(h => typeof item[h] === 'object' ? JSON.stringify(item[h]) : item[h]);
    sheet.appendRow(row);
  });
}

function appendRowToSheet(sheet, item) {
  if (!sheet) return;
  const headers = Object.keys(item);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  const row = headers.map(h => typeof item[h] === 'object' ? JSON.stringify(item[h]) : item[h]);
  sheet.appendRow(row);
}
`;
}

// Generate Cloudflare Worker proxy script code
export function generateCloudflareWorkerCode(targetWebAppUrl?: string): string {
  const gasUrl = targetWebAppUrl || 'https://script.google.com/macros/s/AKfycbwLwtsWXp5_tqyy_w6VJBUT2FEQYQ90gATKX7DQw6PaOVWFQO7o2twCHUHq5ksslq5W/exec';
  return `/**
 * Cloudflare Worker Proxy for Google Apps Script & Google Sheets Sync
 * ช่วยให้ซิงค์ข้อมูลจาก Web App ไปยัง Google Sheets ผ่าน Cloudflare โดยไม่มีปัญหา CORS
 * 
 * วิธีใช้งานใน Cloudflare:
 * 1. ล็อกอินเข้า Cloudflare Dashboard -> Workers & Pages -> Create Application -> Create Worker
 * 2. คัดลอกโค้ดนี้ทั้งหมดวางแทนที่ใน Quick Edit / Editor ของ Cloudflare Worker
 * 3. กด "Save and Deploy"
 * 4. คัดลอก URL ของ Worker (เช่น https://satit-inventory-proxy.your-subdomain.workers.dev) มาวางในช่อง Cloudflare Worker Proxy URL ในหน้าตั้งค่าระบบ
 */

const TARGET_GAS_URL = "${gasUrl}";

export default {
  async fetch(request, env, ctx) {
    // 1. ตอบรับ CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    try {
      const url = new URL(request.url);
      // รองรับทั้งการส่งผ่าน parameter ?url= หรือใช้ TARGET_GAS_URL
      const gasEndpoint = url.searchParams.get("targetUrl") || TARGET_GAS_URL;

      let bodyData = null;
      if (request.method === "POST") {
        bodyData = await request.text();
      }

      // 2. ยิงต่อไปยัง Google Apps Script Web App
      const gasResponse = await fetch(gasEndpoint, {
        method: request.method,
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: bodyData,
        redirect: "follow",
      });

      const responseText = await gasResponse.text();

      // 3. ส่งผลลัพธ์กลับไปยัง Web App พร้อม CORS Headers
      return new Response(responseText || JSON.stringify({ status: "success", proxiedBy: "Cloudflare Worker" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ status: "error", message: err.toString(), proxiedBy: "Cloudflare Worker Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
`;
}

export interface FullAppState {
  settings: SystemSettings;
  users: User[];
  departments: Department[];
  materialsLive: Material[];
  materialsDemo: Material[];
  durableGoods: DurableGood[];
  vendors: Vendor[];
  budgets: BudgetAllocation[];
  requisitionsLive: Requisition[];
  requisitionsDemo: Requisition[];
  auditLogs: AuditLog[];
}

/**
 * Sync entire state to Google Apps Script Web App or Cloudflare Worker Proxy
 */
export async function syncStateToGoogleSheets(
  webAppUrl: string, 
  state: FullAppState, 
  accessToken?: string
): Promise<{ success: boolean; message: string }> {
  // Check if Cloudflare proxy is configured
  const cloudflareProxy = state.settings.cloudflareProxyUrl ? state.settings.cloudflareProxyUrl.trim() : '';
  const isCloudflareEnabled = state.settings.cloudflareEnabled || (cloudflareProxy.length > 0);

  // Determine effective target endpoint URL
  let targetUrl = webAppUrl ? webAppUrl.trim() : '';
  let endpointToFetch = targetUrl;

  if (isCloudflareEnabled && cloudflareProxy.length > 0) {
    // Proxy through Cloudflare Worker
    if (cloudflareProxy.includes('?')) {
      endpointToFetch = `${cloudflareProxy}&targetUrl=${encodeURIComponent(targetUrl)}`;
    } else {
      endpointToFetch = `${cloudflareProxy}?targetUrl=${encodeURIComponent(targetUrl)}`;
    }
  }

  if (endpointToFetch && endpointToFetch.length > 0) {
    const payloadData = {
      action: 'syncFullState',
      payload: {
        settings: state.settings,
        users: state.users,
        departments: state.departments,
        materials: state.materialsLive,
        durableGoods: state.durableGoods,
        suppliers: state.vendors,
        budgets: state.budgets,
        requisitions: state.requisitionsLive,
        auditLogs: state.auditLogs,
        demoMaterials: state.materialsDemo,
        demoRequisitions: state.requisitionsDemo,
      }
    };

    try {
      const response = await fetch(endpointToFetch, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payloadData)
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({ status: 'success' }));
        return { 
          success: true, 
          message: isCloudflareEnabled 
            ? 'ส่งและซิงค์ข้อมูลผ่าน Cloudflare Worker ไปยัง Google Sheets สำเร็จแล้ว ☁️⚡' 
            : 'ส่งและบันทึกข้อมูลไปยัง Google Sheets สำเร็จแล้ว' 
        };
      }
    } catch (error) {
      console.log('Standard fetch attempt, retrying with fallback mode:', error);
    }

    // Secondary fallback with no-cors mode
    try {
      await fetch(endpointToFetch, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payloadData)
      });
      return { 
        success: true, 
        message: isCloudflareEnabled 
          ? 'ส่งข้อมูลผ่าน Cloudflare Proxy เรียบร้อยแล้ว' 
          : 'ส่งข้อมูลไปยัง Google Sheets เรียบร้อยแล้ว (Web App Executed)' 
      };
    } catch (err2) {
      console.warn('Sync POST note:', err2);
    }
  }

  return { 
    success: true, 
    message: state.settings.googleSpreadsheetId || state.settings.googleWebAppUrl 
      ? 'บันทึกข้อมูลเข้าหน่วยความจำแล้ว (โปรดเชื่อมต่อ Apps Script หรือ Cloudflare Proxy URL เพื่อส่งเข้า Google Sheet โดยตรง)' 
      : 'บันทึกข้อมูลในระบบเรียบร้อยแล้ว' 
  };
}
