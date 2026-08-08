import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { User, UserRole } from '../../types';
import { Users, Plus, Edit, Trash2, Search, CheckCircle2, Shield } from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, departments, addUser, updateUser, deleteUser, showConfirmDialog, language } = useApp();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('REQUESTER');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setUsername('');
    setName('');
    setEmail('');
    setRole('REQUESTER');
    setDepartmentId(departments[0]?.id || '');
    setPosition('ครู/อาจารย์');
    setPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: User) => {
    setEditingUser(u);
    setUsername(u.username);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setDepartmentId(u.departmentId);
    setPosition(u.position);
    setPhone(u.phone || '');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !username.trim()) {
      alert('กรุณากรอกชื่อและชื่อผู้ใช้งาน');
      return;
    }

    const dept = departments.find(d => d.id === departmentId);

    if (editingUser) {
      updateUser(editingUser.id, {
        username,
        name,
        email,
        role,
        departmentId,
        departmentName: dept?.name || '',
        position,
        phone
      });
    } else {
      addUser({
        username,
        name,
        email,
        role,
        departmentId,
        departmentName: dept?.name || '',
        position,
        phone,
        active: true
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (u: User) => {
    showConfirmDialog({
      title: t.confirmDeleteTitle,
      message: `${t.confirmDeleteMsg} ผู้ใช้ ${u.name} (${u.username})`,
      confirmText: t.delete,
      isDanger: true,
      onConfirm: () => deleteUser(u.id)
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">จัดการผู้ใช้งานระบบ ({users.length})</h1>
          <p className="text-xs text-slate-500 mt-1">
            กำหนดบัญชีผู้ใช้งาน สิทธิ์การเข้าถึง และสังกัดหน่วยงาน
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm shadow-emerald-200"
        >
          <Plus className="w-4 h-4" />
          เพิ่มผู้ใช้งานใหม่
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ค้นหาผู้ใช้..."
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
                <th className="p-3">ชื่อผู้ใช้ (Username)</th>
                <th className="p-3">ชื่อ-นามสกุล</th>
                <th className="p-3">บทบาท/สิทธิ์</th>
                <th className="p-3">หน่วยงาน/แผนก</th>
                <th className="p-3">ตำแหน่ง</th>
                <th className="p-3 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{u.username}</td>
                  <td className="p-3 font-semibold">{u.name}</td>
                  <td className="p-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">{u.departmentName}</td>
                  <td className="p-3 text-slate-500">{u.position}</td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(u)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
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

      {/* User Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Username *</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">บทบาท (Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="REQUESTER">REQUESTER</option>
                  <option value="APPROVER">APPROVER</option>
                  <option value="INVENTORY_OFFICER">INVENTORY_OFFICER</option>
                  <option value="EXECUTIVE">EXECUTIVE</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-600 mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-600 mb-1">สังกัดแผนก/หน่วยงาน</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">ตำแหน่ง</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
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
