import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Pin,
  AlertTriangle,
  Calendar,
  User,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Announcement, AnnouncementType } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AnnouncementsViewProps {
  isCreateOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  isCreateOpen = false,
  onCloseCreateModal,
}) => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    StorageService.getAnnouncements()
  );

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(isCreateOpen);
  const [viewingItem, setViewingItem] = useState<Announcement | null>(null);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Announcement | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<AnnouncementType>('chuyen_mon');
  const [formContent, setFormContent] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formIsUrgent, setFormIsUrgent] = useState(false);

  const typeLabels: Record<AnnouncementType, { label: string; color: string }> = {
    khan: { label: '🔴 Thông báo Khẩn', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    hop: { label: '📅 Thông báo Họp', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    chuyen_mon: { label: '📚 Thông báo Chuyên môn', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    ke_hoach: { label: '📑 Thông báo Kế hoạch', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    khac: { label: '📢 Thông báo Chung', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  };

  const filtered = useMemo(() => {
    return announcements.filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchContent = item.content.toLowerCase().includes(q);
        const matchAuthor = item.authorName.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchAuthor) return false;
      }
      return true;
    });
  }, [announcements, selectedType, searchQuery]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormType('chuyen_mon');
    setFormContent('');
    setFormIsPinned(false);
    setFormIsUrgent(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormType(item.type);
    setFormContent(item.content);
    setFormIsPinned(item.isPinned);
    setFormIsUrgent(item.isUrgent);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      const updated = announcements.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            title: formTitle,
            type: formType,
            content: formContent,
            isPinned: formIsPinned,
            isUrgent: formIsUrgent,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      StorageService.saveAnnouncements(updated);
      setAnnouncements(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'update',
          'announcement',
          formTitle,
          `Đã cập nhật thông báo của tổ`
        );
      }
    } else {
      const newItem: Announcement = {
        id: `ann-${Date.now()}`,
        title: formTitle,
        type: formType,
        content: formContent,
        authorId: currentUser?.id || 'admin',
        authorName: currentUser?.name || 'Tổ trưởng',
        authorRole: currentUser?.role || 'leader',
        isPinned: formIsPinned,
        isUrgent: formIsUrgent,
        readBy: [currentUser?.id || 'admin'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newItem, ...announcements];
      StorageService.saveAnnouncements(updated);
      setAnnouncements(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'create',
          'announcement',
          newItem.title,
          `Phát thông báo mới cho toàn khối`
        );
        // Push notification to all teachers
        StorageService.addNotification(
          newItem.title,
          newItem.content.slice(0, 80) + '...',
          'announcement',
          undefined,
          'announcements'
        );
      }
    }

    setIsModalOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    const updated = announcements.filter((a) => a.id !== itemToDelete.id);
    StorageService.saveAnnouncements(updated);
    setAnnouncements(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'announcement',
        itemToDelete.title,
        `Đã xóa thông báo`
      );
    }
    setItemToDelete(null);
  };

  const handleMarkAsRead = (item: Announcement) => {
    if (!currentUser || item.readBy.includes(currentUser.id)) return;
    const updated = announcements.map((a) => {
      if (a.id === item.id) {
        return {
          ...a,
          readBy: [...a.readBy, currentUser.id],
        };
      }
      return a;
    });

    StorageService.saveAnnouncements(updated);
    setAnnouncements(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📢 Bảng tin & Thông báo chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kênh thông tin chính thức của Tổ trưởng gửi đến các giáo viên trong Khối B - Mầm non Vỹ Dạ
          </p>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-2xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-amber-950 shadow-sm shadow-amber-300/40 hover:bg-amber-400 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Phát thông báo mới</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 backdrop-blur-md bg-white/60 p-3.5 rounded-3xl border border-white/80 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, nội dung thông báo..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-amber-500 focus:outline-none"
        >
          <option value="all">🔔 Tất cả loại thông báo</option>
          <option value="khan">🔴 Thông báo Khẩn</option>
          <option value="hop">📅 Thông báo Họp</option>
          <option value="chuyen_mon">📚 Thông báo Chuyên môn</option>
          <option value="ke_hoach">📑 Thông báo Kế hoạch</option>
          <option value="khac">📢 Thông báo Chung</option>
        </select>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 backdrop-blur-md bg-white/60 rounded-3xl border border-white/80 p-6 shadow-xs">
            <Megaphone className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Chưa có thông báo nào.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isRead = currentUser ? item.readBy.includes(currentUser.id) : false;
            const typeConfig = typeLabels[item.type] || typeLabels.khac;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setViewingItem(item);
                  handleMarkAsRead(item);
                }}
                className={`cursor-pointer rounded-3xl border border-white/80 backdrop-blur-md p-6 transition-all shadow-sm hover:shadow-lg ${
                  item.isUrgent
                    ? 'bg-rose-50/70 border-rose-300/80 shadow-rose-100/50'
                    : item.isPinned
                    ? 'bg-amber-50/70 border-amber-300/80 shadow-amber-100/50'
                    : isRead
                    ? 'bg-white/65 border-white/80'
                    : 'bg-blue-50/70 border-blue-200/80 shadow-blue-100/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {item.isPinned && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300 backdrop-blur-xs">
                          <Pin className="h-3 w-3" />
                          Ghim đầu trang
                        </span>
                      )}

                      {item.isUrgent && (
                        <span className="flex items-center gap-1 rounded-full bg-rose-100/80 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-300 animate-pulse backdrop-blur-xs">
                          <AlertTriangle className="h-3 w-3" />
                          Khẩn cấp
                        </span>
                      )}

                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border backdrop-blur-xs ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>

                      {!isRead && (
                        <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          Chưa xem
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/60 pt-2">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>Người đăng: <strong className="text-slate-700">{item.authorName}</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>Đã xem: {item.readBy.length} cô</span>
                        <span>{item.createdAt.includes('T') ? item.createdAt.split('T')[0] : item.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Leader */}
                  {isLeader && (
                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-xl p-1.5 text-slate-500 hover:bg-white/80 transition-colors"
                        title="Sửa thông báo"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="rounded-xl p-1.5 text-rose-500 hover:bg-white/80 transition-colors"
                        title="Xóa thông báo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: View Announcement Details */}
      {viewingItem && (
        <Modal
          isOpen={true}
          onClose={() => setViewingItem(null)}
          title={viewingItem.title}
          subtitle={`Người đăng: ${viewingItem.authorName} • Ngày: ${viewingItem.createdAt.split('T')[0]}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {viewingItem.isUrgent && (
                <span className="rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                  🔴 Thông báo Khẩn cấp
                </span>
              )}
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                {typeLabels[viewingItem.type]?.label || 'Thông báo'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto">
              {viewingItem.content}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Đã ghi nhận bạn đã xem thông báo này
              </span>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="rounded-xl px-4 py-2 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create & Edit Announcement */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (onCloseCreateModal) onCloseCreateModal();
        }}
        title={editingItem ? 'Chỉnh sửa thông báo' : 'Phát thông báo mới cho Khối B'}
        subtitle="Thông báo sẽ được gửi thông báo tức thì đến tài khoản các giáo viên"
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tiêu đề thông báo: *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Nhắc nhở nộp giáo án tuần 3 và chuẩn bị đồ dùng thao giảng"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Loại thông báo:</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as AnnouncementType)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
            >
              <option value="chuyen_mon">📚 Thông báo Chuyên môn</option>
              <option value="hop">📅 Thông báo Họp tổ</option>
              <option value="khan">🔴 Thông báo Khẩn cấp</option>
              <option value="ke_hoach">📑 Thông báo Kế hoạch</option>
              <option value="khac">📢 Thông báo Chung</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Nội dung chi tiết thông báo: *</label>
            <textarea
              rows={5}
              required
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Nhập nội dung cần truyền đạt đến các cô giáo trong tổ..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formIsPinned}
                onChange={(e) => setFormIsPinned(e.target.checked)}
                className="rounded accent-amber-600"
              />
              <span>Ghim lên đầu bảng tin</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-rose-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formIsUrgent}
                onChange={(e) => setFormIsUrgent(e.target.checked)}
                className="rounded accent-rose-600"
              />
              <span>Đánh dấu KHẨN CẤP</span>
            </label>
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
              className="rounded-xl px-5 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-xs"
            >
              {editingItem ? 'Lưu thay đổi' : 'Phát thông báo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa thông báo"
        message={`Bạn có chắc muốn xóa thông báo "${itemToDelete?.title}" không?`}
      />
    </div>
  );
};
