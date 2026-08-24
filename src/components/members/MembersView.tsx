import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Award,
  Shield,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { User, UserRole } from '../../types';
import { RoleBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const MembersView: React.FC = () => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [tasks] = useState(() => StorageService.getTasks());

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('teacher');
  const [formTitle, setFormTitle] = useState('');
  const [formClassAssigned, setFormClassAssigned] = useState('');
  const [formDuties, setFormDuties] = useState('');
  const [formAvatar, setFormAvatar] = useState('');

  const filteredUsers = users.filter((u) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchClass = u.classAssigned?.toLowerCase().includes(q);
      const matchTitle = u.title.toLowerCase().includes(q);
      if (!matchName && !matchClass && !matchTitle) return false;
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('giaovien@vyda.edu.vn');
    setFormPhone('0905 123 456');
    setFormRole('teacher');
    setFormTitle('Giáo viên');
    setFormClassAssigned('Lớp Lớn 3');
    setFormDuties('Phụ trách chuyên môn phát triển thẩm mỹ');
    setFormAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher${Date.now()}`);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone || '');
    setFormRole(user.role);
    setFormTitle(user.title);
    setFormClassAssigned(user.classAssigned || '');
    setFormDuties(user.duties || '');
    setFormAvatar(user.avatar || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingUser) {
      const updated = users.map((u) => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: formName,
            email: formEmail,
            phone: formPhone,
            role: formRole,
            title: formTitle,
            classAssigned: formClassAssigned,
            duties: formDuties,
            avatar: formAvatar,
          };
        }
        return u;
      });

      StorageService.saveUsers(updated);
      setUsers(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'update',
          'system',
          formName,
          `Đã cập nhật thông tin thành viên`
        );
      }
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formName,
        email: formEmail,
        phone: formPhone,
        role: formRole,
        title: formTitle,
        classAssigned: formClassAssigned,
        duties: formDuties,
        avatar:
          formAvatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formName)}`,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      const updated = [...users, newUser];
      StorageService.saveUsers(updated);
      setUsers(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'create',
          'system',
          newUser.name,
          `Đã thêm giáo viên mới vào tổ khối B`
        );
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    const updated = users.filter((u) => u.id !== userToDelete.id);
    StorageService.saveUsers(updated);
    setUsers(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'system',
        userToDelete.name,
        `Đã xóa thành viên khỏi danh sách tổ`
      );
    }
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>👥 Quản lý thành viên Khối B</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách giáo viên, chức vụ, lớp phụ trách và phân công nhiệm vụ chuyên môn
          </p>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm giáo viên mới</span>
          </button>
        )}
      </div>

      {/* Search Row */}
      <div className="backdrop-blur-md bg-white/60 p-3.5 rounded-3xl border border-white/80 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo họ tên giáo viên, lớp phụ trách..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => {
          const userTasks = tasks.filter((t) => t.assignedTo === u.id);
          const doneTasks = userTasks.filter((t) => t.status === 'completed');
          const completionRate =
            userTasks.length > 0 ? Math.round((doneTasks.length / userTasks.length) * 100) : 0;

          return (
            <div
              key={u.id}
              className="flex flex-col justify-between rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 p-5 shadow-sm hover:shadow-lg hover:border-white/95 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white/80 shadow-xs"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                        {u.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RoleBadge role={u.role} />
                        <span className="text-[11px] font-semibold text-slate-500">{u.title}</span>
                      </div>
                    </div>
                  </div>

                  {isLeader && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(u)}
                        className="rounded-xl p-1.5 text-slate-400 hover:bg-white/80 hover:text-slate-700 transition-colors"
                        title="Sửa thông tin"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button
                          type="button"
                          onClick={() => setUserToDelete(u)}
                          className="rounded-xl p-1.5 text-slate-400 hover:bg-white/80 hover:text-rose-600 transition-colors"
                          title="Xóa giáo viên"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-white/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Lớp phụ trách:</span>
                    <strong className="text-slate-800">{u.classAssigned || 'Tổ chuyên môn'}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nhiệm vụ:</span>
                    <span className="text-slate-700 font-medium truncate max-w-[170px] text-right">
                      {u.duties || 'Giảng dạy mầm non'}
                    </span>
                  </div>

                  {u.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> SĐT:
                      </span>
                      <a href={`tel:${u.phone}`} className="text-teal-700 font-semibold hover:underline">
                        {u.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email:
                    </span>
                    <span className="text-slate-600 truncate max-w-[160px]">{u.email}</span>
                  </div>
                </div>
              </div>

              {/* Task load progress */}
              <div className="mt-4 pt-3 border-t border-white/60 backdrop-blur-md bg-white/50 p-3 rounded-2xl border border-white/60">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                  <span>Khối lượng công việc</span>
                  <span className="text-teal-800">
                    {doneTasks.length}/{userTasks.length} việc ({completionRate}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create & Edit User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Chỉnh sửa thông tin giáo viên' : 'Thêm giáo viên mới vào tổ'}
        subtitle="Quản lý hồ sơ nhân sự và phân công nhiệm vụ chuyên môn khối"
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Họ và tên giáo viên: *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ví dụ: Cô Hoàng Thị Thu"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Vai trò / Phân quyền:</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
              >
                <option value="teacher">Giáo viên (Quyền tiêu chuẩn)</option>
                <option value="leader">Tổ trưởng chuyên môn (Toàn quyền)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Chức danh:</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Giáo viên Lớp Lớn 1"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Lớp phụ trách:</label>
              <input
                type="text"
                value={formClassAssigned}
                onChange={(e) => setFormClassAssigned(e.target.value)}
                placeholder="Lớp Lớn 1 / Lớp Nhỡ 2"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Số điện thoại:</label>
              <input
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="0905 123 456"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Email:</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="thu.hoang@vyda.edu.vn"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Nhiệm vụ chuyên môn được giao:</label>
            <textarea
              rows={2}
              value={formDuties}
              onChange={(e) => setFormDuties(e.target.value)}
              placeholder="Ví dụ: Phụ trách chuyên môn Lĩnh vực Thẩm mỹ, quản lý góc âm nhạc khối..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs"
            >
              {editingUser ? 'Lưu thông tin' : 'Thêm giáo viên'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa giáo viên khỏi danh sách"
        message={`Bạn có chắc muốn xóa cô "${userToDelete?.name}" khỏi danh sách thành viên Khối B không?`}
      />
    </div>
  );
};
