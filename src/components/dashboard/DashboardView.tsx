import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  BookOpen,
  FolderArchive,
  Megaphone,
  Plus,
  ArrowRight,
  TrendingUp,
  Calendar as CalendarIcon,
  Sparkles,
  Users,
  ChevronRight,
  MessageSquareHeart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Task, Announcement, Plan, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';

interface DashboardViewProps {
  onNavigate: (tab: string, itemId?: string) => void;
  onOpenTaskModal: () => void;
  onOpenLessonModal: () => void;
  onOpenDocModal: () => void;
  onOpenAnnouncementModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenTaskModal,
  onOpenLessonModal,
  onOpenDocModal,
  onOpenAnnouncementModal,
}) => {
  const { currentUser, isLeader } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks());
  const [announcements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  const [plans] = useState<Plan[]>(() => StorageService.getPlans());

  // Re-read data on change
  const refreshTasks = () => {
    setTasks(StorageService.getTasks());
  };

  // Quick statistics
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.startDate <= todayStr && t.dueDate >= todayStr);
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const docs = StorageService.getDocuments();

    return {
      todayCount: todayTasks.length,
      inProgressCount: inProgressTasks.length,
      completedCount: completedTasks.length,
      pendingCount: pendingTasks.length,
      totalCount: tasks.length,
      completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
      activePlansCount: plans.filter(p => p.status !== 'completed').length,
      totalDocsCount: docs.length,
      announcementsCount: announcements.length,
    };
  }, [tasks, plans, announcements]);

  // "Việc của tôi hôm nay" (Current user's tasks)
  const myTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(
      t =>
        t.assignedTo === currentUser.id ||
        (t.coordinators && t.coordinators.includes(currentUser.id)) ||
        (isLeader && t.status !== 'completed') // Leader sees actionable tasks too
    );
  }, [tasks, currentUser, isLeader]);

  // Handle instant status toggle for a task directly on dashboard
  const handleQuickStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const newProgress = newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 50 : 0;
        const updated = {
          ...t,
          status: newStatus,
          progress: newProgress,
          updatedAt: new Date().toISOString(),
          updatedByName: currentUser?.name,
        };
        if (currentUser) {
          StorageService.addActivityLog(
            currentUser,
            'status_change',
            'task',
            t.title,
            `Đã chuyển trạng thái sang "${newStatus === 'completed' ? 'Hoàn thành' : newStatus === 'in_progress' ? 'Đang thực hiện' : 'Chưa thực hiện'}"`
          );
        }
        return updated;
      }
      return t;
    });

    StorageService.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const handleQuickProgressUpdate = (taskId: string, progress: number) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const newStatus: TaskStatus = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending';
        const updated = {
          ...t,
          progress,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          updatedByName: currentUser?.name,
        };
        if (currentUser) {
          StorageService.addActivityLog(
            currentUser,
            'progress_update',
            'task',
            t.title,
            `Cập nhật tiến độ: ${progress}%`
          );
        }
        return updated;
      }
      return t;
    });

    StorageService.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner: Greeting & Slogan */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 p-6 md:p-8 text-white shadow-xl border border-white/40">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-white/20 blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/2 bottom-0 -mb-8 h-40 w-40 rounded-full bg-pink-400/25 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/30">
              <span>🌸</span>
              <span className="font-bold uppercase tracking-wider">KHỐI B - TRƯỜNG MẦM NON VỸ DẠ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Xin chào, <span className="text-amber-200">{currentUser?.name}</span>! 👋
            </h2>
            <p className="text-xs md:text-sm text-blue-100 italic max-w-2xl font-medium">
              "Kết nối chuyên môn - Chia sẻ trách nhiệm - Đồng hành hiệu quả"
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isLeader && (
              <button
                id="btn-dashboard-add-task"
                type="button"
                onClick={onOpenTaskModal}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4 text-blue-600" />
                <span>Thêm công việc</span>
              </button>
            )}

            <button
              id="btn-dashboard-add-lesson"
              type="button"
              onClick={onOpenLessonModal}
              className="flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white border border-white/40 hover:bg-white/30 active:scale-95 transition-all shadow-xs"
            >
              <BookOpen className="h-4 w-4 text-amber-200" />
              <span>Thêm giáo án</span>
            </button>

            <button
              id="btn-dashboard-add-doc"
              type="button"
              onClick={onOpenDocModal}
              className="flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white border border-white/40 hover:bg-white/30 active:scale-95 transition-all shadow-xs"
            >
              <FolderArchive className="h-4 w-4 text-cyan-200" />
              <span>Tải tài liệu</span>
            </button>

            {isLeader && (
              <button
                id="btn-dashboard-add-announcement"
                type="button"
                onClick={onOpenAnnouncementModal}
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-300 active:scale-95 transition-all"
              >
                <Megaphone className="h-4 w-4" />
                <span>Tạo thông báo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Quick Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Card 1: Công việc hôm nay */}
        <div
          onClick={() => onNavigate('tasks')}
          className="cursor-pointer rounded-2xl backdrop-blur-md bg-white/60 p-4 border border-white/80 shadow-xs hover:shadow-md hover:bg-white/80 hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">Việc hôm nay</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
              <CalendarIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
            {stats.todayCount}
          </p>
          <span className="text-[10px] text-slate-500">Nhiệm vụ trong ngày</span>
        </div>

        {/* Card 2: Đang thực hiện (VÀNG) */}
        <div
          onClick={() => onNavigate('tasks')}
          className="cursor-pointer rounded-2xl backdrop-blur-md bg-amber-50/70 p-4 border border-amber-200/80 shadow-xs hover:shadow-md hover:bg-amber-50 transition-all group"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[11px] font-bold">Đang thực hiện</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-200/70 text-amber-800">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-amber-900">{stats.inProgressCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">🟡 Đang tiến hành</span>
        </div>

        {/* Card 3: Đã hoàn thành (XANH) */}
        <div
          onClick={() => onNavigate('tasks')}
          className="cursor-pointer rounded-2xl backdrop-blur-md bg-emerald-50/70 p-4 border border-emerald-200/80 shadow-xs hover:shadow-md hover:bg-emerald-50 transition-all group"
        >
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-bold">Đã hoàn thành</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-200/70 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-900">{stats.completedCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">🟢 Đạt {stats.completionRate}%</span>
        </div>

        {/* Card 4: Chưa thực hiện (ĐỎ) */}
        <div
          onClick={() => onNavigate('tasks')}
          className="cursor-pointer rounded-2xl backdrop-blur-md bg-rose-50/70 p-4 border border-rose-200/80 shadow-xs hover:shadow-md hover:bg-rose-50 transition-all group"
        >
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-[11px] font-bold">Chưa thực hiện</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-200/70 text-rose-800">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-rose-900">{stats.pendingCount}</p>
          <span className="text-[10px] text-rose-700 font-medium">🔴 Cần bắt đầu</span>
        </div>

        {/* Card 5: Kế hoạch sắp đến hạn */}
        <div
          onClick={() => onNavigate('plans')}
          className="cursor-pointer rounded-2xl backdrop-blur-md bg-white/60 p-4 border border-white/80 shadow-xs hover:shadow-md hover:border-purple-300 hover:bg-white/80 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">Kế hoạch</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-100/70 text-purple-600">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
            {stats.activePlansCount}
          </p>
          <span className="text-[10px] text-slate-500">Đang triển khai</span>
        </div>

        {/* Card 6: Tài liệu mới */}
        <div
          onClick={() => onNavigate('documents')}
          className="cursor-pointer rounded-2xl backdrop-blur-md bg-white/60 p-4 border border-white/80 shadow-xs hover:shadow-md hover:border-cyan-300 hover:bg-white/80 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">Tài liệu</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-100/70 text-cyan-600">
              <FolderArchive className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors">
            {stats.totalDocsCount}
          </p>
          <span className="text-[10px] text-slate-500">Văn bản & Biểu mẫu</span>
        </div>

        {/* Card 7: Thông báo mới */}
        <div
          onClick={() => onNavigate('announcements')}
          className="cursor-pointer rounded-2xl backdrop-blur-md bg-white/60 p-4 border border-white/80 shadow-xs hover:shadow-md hover:border-amber-300 hover:bg-white/80 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">Thông báo</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600">
              <Megaphone className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
            {stats.announcementsCount}
          </p>
          <span className="text-[10px] text-slate-500">Tin tức của khối</span>
        </div>
      </div>

      {/* 3. Important Announcements Banner */}
      {announcements.length > 0 && (
        <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/60 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs shadow-sm">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                  Thông báo nổi bật từ Tổ trưởng
                </span>
                <button
                  onClick={() => onNavigate('announcements')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline shrink-0"
                >
                  Xem tất cả ({announcements.length}) →
                </button>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1">{announcements[0].title}</p>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                {announcements[0].content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Section: "Việc của tôi" & Live Progress Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive "Việc của tôi" Checklist */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-xs font-bold">
                ✓
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {isLeader ? 'Công việc cần theo dõi & thực hiện' : 'Việc của tôi'}
              </h3>
              <span className="rounded-full backdrop-blur-md bg-white/70 border border-white/80 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {myTasks.length} nhiệm vụ
              </span>
            </div>

            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Xem toàn bộ danh sách</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {myTasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/80 backdrop-blur-md bg-white/50 p-8 text-center text-slate-400">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Tất cả công việc đã hoàn thành!</p>
              <p className="text-xs text-slate-400 mt-1">Không có công việc nào đang chờ xử lý.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {myTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/65 p-4 shadow-2xs hover:shadow-md hover:bg-white/80 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="rounded-lg bg-white/80 border border-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-2xs">
                          {task.code}
                        </span>
                        <StatusBadge status={task.status} size="sm" />
                        <PriorityBadge priority={task.priority} />
                        <span className="text-[11px] text-slate-500">
                          Hạn: <strong className="text-slate-800">{task.dueDate}</strong>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{task.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{task.description}</p>

                      <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={task.assignedToAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'}
                            alt={task.assignedToName}
                            className="h-4 w-4 rounded-full object-cover ring-1 ring-white"
                          />
                          <span className="font-medium text-slate-700">{task.assignedToName}</span>
                        </div>

                        {task.notes && (
                          <span className="text-slate-500 truncate max-w-xs italic">
                            💬 {task.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick interactive controls: Progress slider & 1-click status */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/60">
                      {/* 1-Click Status Toggles */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(task.id, 'completed')}
                          title="Đánh dấu Hoàn thành"
                          className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all shadow-2xs ${
                            task.status === 'completed'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'backdrop-blur-md bg-emerald-50/80 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
                          }`}
                        >
                          🟢 Đã xong
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(task.id, 'in_progress')}
                          title="Đang làm"
                          className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all shadow-2xs ${
                            task.status === 'in_progress'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'backdrop-blur-md bg-amber-50/80 text-amber-800 border border-amber-200/60 hover:bg-amber-100'
                          }`}
                        >
                          🟡 Đang làm
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(task.id, 'pending')}
                          title="Chưa làm"
                          className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all shadow-2xs ${
                            task.status === 'pending'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'backdrop-blur-md bg-rose-50/80 text-rose-800 border border-rose-200/60 hover:bg-rose-100'
                          }`}
                        >
                          🔴 Chưa làm
                        </button>
                      </div>

                      {/* Progress Bar & Quick Adjuster */}
                      <div className="flex items-center gap-2 w-full sm:w-36">
                        <div className="flex-1 h-2 rounded-full bg-slate-200/70 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              task.progress === 100
                                ? 'bg-emerald-500'
                                : task.progress >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 min-w-[32px] text-right">
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Quick Links, Calendar & Discussions Preview */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Access to Progress Tracking Table */}
          <div
            onClick={() => onNavigate('progress-table')}
            className="cursor-pointer rounded-3xl bg-gradient-to-br from-indigo-600/90 via-blue-600/90 to-pink-600/90 backdrop-blur-xl p-5 text-white shadow-lg border border-white/40 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Bảng trực quan
              </span>
              <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-base font-extrabold mt-1">Bảng theo dõi tiến độ chi tiết</h4>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              Theo dõi STT, Người phụ trách, Trạng thái màu sắc và Thanh % tiến độ theo thời gian thực.
            </p>
          </div>

          {/* Academic Plans upcoming */}
          <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/60 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase">Kế hoạch chuyên môn</h4>
              </div>
              <button
                onClick={() => onNavigate('plans')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Tất cả →
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {plans.slice(0, 3).map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => onNavigate('plans', plan.id)}
                  className="p-2.5 rounded-2xl backdrop-blur-sm bg-white/70 border border-white/80 hover:bg-white/90 cursor-pointer transition-colors shadow-2xs"
                >
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{plan.title}</p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                    <span>Phụ trách: <strong>{plan.assignedToName}</strong></span>
                    <span className="text-purple-600 font-bold">{plan.academicYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Team Member Snapshot */}
          <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/60 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase">Giáo viên Khối B</h4>
              </div>
              <button
                onClick={() => onNavigate('members')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Xem chi tiết →
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {StorageService.getUsers().map((u) => {
                const userTasks = tasks.filter(t => t.assignedTo === u.id);
                const doneTasks = userTasks.filter(t => t.status === 'completed');
                return (
                  <div key={u.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={u.avatar} alt={u.name} className="h-6 w-6 rounded-full object-cover ring-1 ring-white" />
                      <span className="text-xs font-semibold text-slate-800 truncate">{u.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-bold">
                      {doneTasks.length}/{userTasks.length} việc
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
