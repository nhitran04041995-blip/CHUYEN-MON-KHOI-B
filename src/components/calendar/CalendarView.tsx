import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { CalendarEvent, CalendarEventType } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const CalendarView: React.FC = () => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>(() => StorageService.getCalendarEvents());

  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<CalendarEventType>('hop_chuyen_mon');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('10:30');
  const [formLocation, setFormLocation] = useState('Văn phòng Khối B');
  const [formParticipants, setFormParticipants] = useState('Toàn thể giáo viên Khối B');
  const [formDescription, setFormDescription] = useState('');

  const typeLabels: Record<string, { label: string; color: string }> = {
    hop_chuyen_mon: { label: 'Họp chuyên môn', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    hop_to: { label: 'Họp tổ', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    du_gio: { label: 'Dự giờ sinh hoạt', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    thao_giang: { label: 'Thao giảng khối', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    kiem_tra_so_sach: { label: 'Kiểm tra hồ sơ', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    nop_giao_an: { label: 'Hạn nộp giáo án', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    han_giao_an: { label: 'Hạn nộp giáo án', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    han_ke_hoach: { label: 'Hạn kế hoạch', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    chuyen_de: { label: 'Chuyên đề', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    hoat_dong_gd: { label: 'Hoạt động GD', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    su_kien_chung: { label: 'Sự kiện toàn trường', color: 'bg-slate-100 text-slate-800 border-slate-200' },
    khac: { label: 'Sự kiện khác', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  };

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => {
        if (selectedType !== 'all' && e.type !== selectedType) return false;
        return true;
      })
      .sort((a, b) => {
        const dateA = a.date || a.startDate || '';
        const dateB = b.date || b.startDate || '';
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
  }, [events, selectedType]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormTitle('');
    setFormType('hop_chuyen_mon');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStartTime('08:00');
    setFormEndTime('10:30');
    setFormLocation('Phòng sinh hoạt chuyên môn Khối B');
    setFormParticipants('Tổ trưởng và các giáo viên Khối B');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormType(evt.type);
    setFormDate(evt.date || evt.startDate || new Date().toISOString().split('T')[0]);
    setFormStartTime(evt.startTime || '08:00');
    setFormEndTime(evt.endTime || '10:30');
    setFormLocation(evt.location || '');
    setFormParticipants(typeof evt.participants === 'string' ? evt.participants : evt.participants?.join(', ') || '');
    setFormDescription(evt.description || '');
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingEvent) {
      const updated = events.map((ev) => {
        if (ev.id === editingEvent.id) {
          return {
            ...ev,
            title: formTitle,
            type: formType,
            date: formDate,
            startTime: formStartTime,
            endTime: formEndTime,
            location: formLocation,
            participants: formParticipants,
            description: formDescription,
            updatedAt: new Date().toISOString(),
          };
        }
        return ev;
      });

      StorageService.saveCalendarEvents(updated);
      setEvents(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'update',
          'calendar',
          formTitle,
          `Đã cập nhật lịch công tác`
        );
      }
    } else {
      const newEvent: CalendarEvent = {
        id: `evt-${Date.now()}`,
        title: formTitle,
        type: formType,
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        location: formLocation,
        participants: formParticipants,
        description: formDescription,
        createdBy: currentUser?.id || 'admin',
        createdByName: currentUser?.name || 'Tổ trưởng',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newEvent, ...events];
      StorageService.saveCalendarEvents(updated);
      setEvents(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'create',
          'calendar',
          newEvent.title,
          `Đã lên lịch công tác mới (${newEvent.date})`
        );
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!eventToDelete) return;
    const updated = events.filter((e) => e.id !== eventToDelete.id);
    StorageService.saveCalendarEvents(updated);
    setEvents(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'calendar',
        eventToDelete.title,
        `Đã hủy sự kiện lịch công tác`
      );
    }
    setEventToDelete(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📅 Lịch công tác & Sự kiện chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi lịch họp tổ, lịch dự giờ thao giảng, kiểm tra hồ sơ và các hạn nộp giáo án trong khối
          </p>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-rose-300/40 hover:bg-rose-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm sự kiện / Lịch mới</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md bg-white/60 p-3.5 rounded-3xl border border-white/80 shadow-xs">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-rose-500 focus:outline-none w-full sm:w-64"
        >
          <option value="all">🗓️ Tất cả sự kiện lịch</option>
          <option value="hop_chuyen_mon">Họp chuyên môn khối</option>
          <option value="du_gio">Lịch dự giờ sinh hoạt</option>
          <option value="thao_giang">Lịch thao giảng</option>
          <option value="kiem_tra_so_sach">Kiểm tra sổ sách, hồ sơ</option>
          <option value="nop_giao_an">Hạn nộp giáo án</option>
          <option value="su_kien_chung">Sự kiện toàn trường</option>
        </select>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 backdrop-blur-md bg-white/60 rounded-3xl border border-white/80 p-6 shadow-xs">
            <CalendarIcon className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Chưa có lịch công tác nào trong thời gian tới.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const typeConfig = typeLabels[evt.type] || typeLabels.hop_chuyen_mon;
            const evtDate = evt.date || evt.startDate || '2026-08-25';
            const dateParts = evtDate.split('-');
            const monthStr = dateParts[1] || '08';
            const dayStr = dateParts[2] || '25';
            const startTimeStr = evt.startTime || (evt.time ? evt.time.split('-')[0]?.trim() : '08:00');
            const endTimeStr = evt.endTime || (evt.time ? evt.time.split('-')[1]?.trim() : '10:30');

            return (
              <div
                key={evt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 p-4 shadow-sm hover:shadow-lg hover:border-white/95 transition-all gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  {/* Date badge */}
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-rose-50/80 border border-rose-200/80 text-rose-700 backdrop-blur-xs">
                    <span className="text-[10px] font-bold uppercase">Tháng {monthStr}</span>
                    <span className="text-lg font-black">{dayStr}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border backdrop-blur-xs ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {startTimeStr} - {endTimeStr}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                      {evt.title}
                    </h3>

                    {evt.description && (
                      <p className="text-xs text-slate-500 line-clamp-1">{evt.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      {evt.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-rose-500" />
                          {evt.location}
                        </span>
                      )}
                      {evt.participants && (
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <Users className="h-3.5 w-3.5 text-blue-500" />
                          {evt.participants}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isLeader && (
                  <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/60">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(evt)}
                      className="rounded-xl p-1.5 text-slate-500 hover:bg-white/80 transition-colors"
                      title="Sửa sự kiện"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventToDelete(evt)}
                      className="rounded-xl p-1.5 text-rose-500 hover:bg-white/80 transition-colors"
                      title="Xóa sự kiện"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create & Edit Event */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Chỉnh sửa sự kiện lịch' : 'Thêm sự kiện lịch công tác mới'}
        subtitle="Lập lịch họp tổ, dự giờ, thao giảng hoặc hạn nộp hồ sơ chuyên môn"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên sự kiện / Cuộc họp: *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Sinh hoạt chuyên môn Khối B lần 1 tháng 9"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Loại sự kiện:</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as CalendarEventType)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              >
                <option value="hop_chuyen_mon">Họp chuyên môn khối</option>
                <option value="du_gio">Lịch dự giờ sinh hoạt</option>
                <option value="thao_giang">Lịch thao giảng</option>
                <option value="kiem_tra_so_sach">Kiểm tra sổ sách, hồ sơ</option>
                <option value="nop_giao_an">Hạn nộp giáo án</option>
                <option value="su_kien_chung">Sự kiện toàn trường</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Ngày diễn ra: *</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Giờ bắt đầu:</label>
              <input
                type="time"
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Giờ kết thúc:</label>
              <input
                type="time"
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Địa điểm:</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Văn phòng Khối B / Lớp Lớn 1"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Thành phần tham gia:</label>
              <input
                type="text"
                value={formParticipants}
                onChange={(e) => setFormParticipants(e.target.value)}
                placeholder="Toàn thể giáo viên Khối B"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Nội dung chi tiết / Chuẩn bị:</label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Yêu cầu giáo viên mang theo sổ giáo án và tài liệu nghiên cứu..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
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
              className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
            >
              {editingEvent ? 'Lưu thay đổi' : 'Lên lịch sự kiện'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa sự kiện lịch"
        message={`Bạn có chắc muốn xóa lịch "${eventToDelete?.title}" không?`}
      />
    </div>
  );
};
