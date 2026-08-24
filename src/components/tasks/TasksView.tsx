import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Paperclip,
  Calendar,
  User,
  CheckSquare,
  LayoutGrid,
  List,
  Sparkles,
  ChevronDown,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Task, TaskPeriod, TaskPriority, TaskStatus, TaskAttachment } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface TasksViewProps {
  initialTaskId?: string;
  isCreateOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  initialTaskId,
  isCreateOpen = false,
  onCloseCreateModal,
}) => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks());
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(isCreateOpen);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [updatingProgressTask, setUpdatingProgressTask] = useState<Task | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAssignedTo, setFormAssignedTo] = useState('');
  const [formCoordinators, setFormCoordinators] = useState<string[]>([]);
  const [formPeriod, setFormPeriod] = useState<TaskPeriod>('weekly');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formStatus, setFormStatus] = useState<TaskStatus>('pending');
  const [formProgress, setFormProgress] = useState(0);
  const [formNotes, setFormNotes] = useState('');
  const [formEvidence, setFormEvidence] = useState('');
  const [formAttachmentName, setFormAttachmentName] = useState('');

  useEffect(() => {
    if (isCreateOpen) {
      handleOpenCreateModal();
    }
  }, [isCreateOpen]);

  const refreshTasks = () => {
    setTasks(StorageService.getTasks());
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchCode = t.code.toLowerCase().includes(q);
        const matchTeacher = t.assignedToName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCode && !matchTeacher) return false;
      }
      // Period
      if (filterPeriod !== 'all' && t.period !== filterPeriod) return false;
      // Status
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      // Priority
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      // Teacher
      if (filterTeacher !== 'all' && t.assignedTo !== filterTeacher) return false;

      return true;
    });
  }, [tasks, searchQuery, filterPeriod, filterStatus, filterPriority, filterTeacher]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormAssignedTo(currentUser?.id || allUsers[0]?.id || '');
    setFormCoordinators([]);
    setFormPeriod('weekly');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormDueDate(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
    setFormPriority('medium');
    setFormStatus('pending');
    setFormProgress(0);
    setFormNotes('');
    setFormEvidence('');
    setFormAttachmentName('');
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormAssignedTo(task.assignedTo);
    setFormCoordinators(task.coordinators || []);
    setFormPeriod(task.period);
    setFormStartDate(task.startDate);
    setFormDueDate(task.dueDate);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormProgress(task.progress);
    setFormNotes(task.notes || '');
    setFormEvidence(task.resultEvidence || '');
    setFormAttachmentName(task.attachments?.[0]?.name || '');
    setIsTaskModalOpen(true);
  };

  const handleDuplicateTask = (task: Task) => {
    const nextIndex = tasks.length + 1;
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      code: `CV-${String(nextIndex).padStart(3, '0')}`,
      title: `${task.title} (Bản sao)`,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser?.id || 'admin',
      createdByName: currentUser?.name || 'Tổ trưởng',
    };

    const updated = [newTask, ...tasks];
    StorageService.saveTasks(updated);
    setTasks(updated);
    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'create',
        'task',
        newTask.title,
        `Đã sao chép từ công việc ${task.code}`
      );
    }
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const assignedUser = allUsers.find((u) => u.id === formAssignedTo);
    const coordinatorNames = formCoordinators.map(
      (id) => allUsers.find((u) => u.id === id)?.name || ''
    );

    const attachments: TaskAttachment[] = formAttachmentName
      ? [
          {
            id: `att-${Date.now()}`,
            name: formAttachmentName,
            url: '#',
            type: formAttachmentName.split('.').pop() || 'doc',
          },
        ]
      : editingTask?.attachments || [];

    if (editingTask) {
      // Edit
      const updatedList = tasks.map((t) => {
        if (t.id === editingTask.id) {
          const updated: Task = {
            ...t,
            title: formTitle,
            description: formDescription,
            assignedTo: formAssignedTo,
            assignedToName: assignedUser?.name || t.assignedToName,
            assignedToAvatar: assignedUser?.avatar,
            coordinators: formCoordinators,
            coordinatorNames,
            period: formPeriod,
            startDate: formStartDate,
            dueDate: formDueDate,
            priority: formPriority,
            status: formStatus,
            progress: formProgress,
            notes: formNotes,
            resultEvidence: formEvidence,
            attachments,
            updatedAt: new Date().toISOString(),
            updatedByName: currentUser?.name,
          };
          return updated;
        }
        return t;
      });

      StorageService.saveTasks(updatedList);
      setTasks(updatedList);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'update',
          'task',
          formTitle,
          `Chỉnh sửa thông tin công việc`
        );
      }
    } else {
      // Create new
      const nextIndex = tasks.length + 1;
      const newTask: Task = {
        id: `task-${Date.now()}`,
        code: `CV-${String(nextIndex).padStart(3, '0')}`,
        title: formTitle,
        description: formDescription,
        assignedTo: formAssignedTo,
        assignedToName: assignedUser?.name || 'Chưa phân công',
        assignedToAvatar: assignedUser?.avatar,
        coordinators: formCoordinators,
        coordinatorNames,
        period: formPeriod,
        startDate: formStartDate,
        dueDate: formDueDate,
        priority: formPriority,
        status: formStatus,
        progress: formProgress,
        notes: formNotes,
        resultEvidence: formEvidence,
        attachments,
        createdBy: currentUser?.id || 'admin',
        createdByName: currentUser?.name || 'Tổ trưởng',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedList = [newTask, ...tasks];
      StorageService.saveTasks(updatedList);
      setTasks(updatedList);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'create',
          'task',
          newTask.title,
          `Phân công cho ${newTask.assignedToName}`
        );
        // Dispatch notification
        StorageService.addNotification(
          'Công việc mới được phân công',
          `Bạn được giao công việc: ${newTask.title} (Hạn: ${newTask.dueDate})`,
          'task_assigned',
          newTask.assignedTo,
          'tasks'
        );
      }
    }

    setIsTaskModalOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    const updated = tasks.filter((t) => t.id !== taskToDelete.id);
    StorageService.saveTasks(updated);
    setTasks(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'task',
        taskToDelete.title,
        `Đã xóa công việc ${taskToDelete.code}`
      );
    }
    setTaskToDelete(null);
  };

  // Quick teacher progress update dialog
  const handleTeacherSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingProgressTask) return;

    const newStatus: TaskStatus =
      formProgress === 100 ? 'completed' : formProgress > 0 ? 'in_progress' : 'pending';

    const updated = tasks.map((t) => {
      if (t.id === updatingProgressTask.id) {
        return {
          ...t,
          progress: formProgress,
          status: newStatus,
          notes: formNotes,
          resultEvidence: formEvidence,
          updatedAt: new Date().toISOString(),
          updatedByName: currentUser?.name,
        };
      }
      return t;
    });

    StorageService.saveTasks(updated);
    setTasks(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'progress_update',
        'task',
        updatingProgressTask.title,
        `Giáo viên cập nhật tiến độ: ${formProgress}% - ${newStatus === 'completed' ? 'Hoàn thành' : 'Đang làm'}`
      );
    }

    setUpdatingProgressTask(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📋 Quản lý công việc chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi, phân công và kiểm soát tiến độ công việc hàng ngày, hàng tuần, hàng tháng của tổ khối B
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-2xl backdrop-blur-md bg-white/60 p-1 border border-white/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="h-4 w-4" />
              <span>Danh sách</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Kanban</span>
            </button>
          </div>

          {/* Add Task Button (Lead Only) */}
          {isLeader && (
            <button
              id="btn-tasks-add-new"
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-300/40 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm công việc mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl backdrop-blur-md bg-white/60 p-4 border border-white/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên việc, mã việc, giáo viên..."
              className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Filter Period */}
          <div>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">📅 Chu kỳ: Tất cả</option>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
              <option value="school_year">Theo năm học</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">⚡ Trạng thái: Tất cả</option>
              <option value="completed">🟢 Hoàn thành</option>
              <option value="in_progress">🟡 Đang thực hiện</option>
              <option value="pending">🔴 Chưa thực hiện</option>
            </select>
          </div>

          {/* Filter Teacher */}
          <div>
            <select
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">👩‍🏫 Phụ trách: Tất cả giáo viên</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View Content: List vs Kanban */}
      {viewMode === 'list' ? (
        <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/80 backdrop-blur-md border-b border-white/80 text-blue-950 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-3 w-16 text-center">Mã</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Tên & Nội dung công việc</th>
                  <th className="py-3.5 px-4 min-w-[160px]">Người phụ trách</th>
                  <th className="py-3.5 px-3 min-w-[110px]">Thời hạn</th>
                  <th className="py-3.5 px-3">Mức độ</th>
                  <th className="py-3.5 px-3 min-w-[130px]">Trạng thái</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Tiến độ</th>
                  <th className="py-3.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Không tìm thấy công việc phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-white/60 transition-colors group">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">{task.code}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{task.description}</p>
                        {task.notes && (
                          <span className="inline-block text-[10px] text-slate-400 italic mt-1">
                            💬 {task.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={task.assignedToAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'}
                            alt={task.assignedToName}
                            className="h-6 w-6 rounded-full object-cover ring-1 ring-white"
                          />
                          <div>
                            <p className="font-semibold text-slate-800">{task.assignedToName}</p>
                            {task.coordinatorNames && task.coordinatorNames.length > 0 && (
                              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                Phối hợp: {task.coordinatorNames.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700">{task.dueDate}</span>
                        <span className="block text-[10px] text-slate-400">Từ {task.startDate}</span>
                      </td>
                      <td className="py-3 px-3">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={task.status} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
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
                          <span className="font-bold text-slate-700 min-w-[28px] text-right">
                            {task.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Teacher can quickly update progress */}
                          <button
                            type="button"
                            onClick={() => {
                              setUpdatingProgressTask(task);
                              setFormProgress(task.progress);
                              setFormNotes(task.notes || '');
                              setFormEvidence(task.resultEvidence || '');
                            }}
                            className="rounded-xl p-1.5 text-blue-600 hover:bg-white/80 transition-colors"
                            title="Cập nhật tiến độ & Ghi chú"
                          >
                            <FileCheck className="h-4 w-4" />
                          </button>

                          {/* Leader Actions */}
                          {isLeader && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDuplicateTask(task)}
                                className="rounded-xl p-1.5 text-slate-500 hover:bg-white/80 transition-colors"
                                title="Sao chép công việc"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(task)}
                                className="rounded-xl p-1.5 text-amber-600 hover:bg-white/80 transition-colors"
                                title="Chỉnh sửa công việc"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setTaskToDelete(task)}
                                className="rounded-xl p-1.5 text-rose-600 hover:bg-white/80 transition-colors"
                                title="Xóa công việc"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Chưa thực hiện (🔴) */}
          <div className="rounded-3xl backdrop-blur-md bg-rose-50/60 border border-rose-200/80 p-4 flex flex-col min-h-[500px] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-rose-200/70">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                <h3 className="font-bold text-rose-900 text-xs uppercase">Chưa thực hiện</h3>
              </div>
              <span className="rounded-full bg-rose-100/90 px-2 py-0.5 text-xs font-extrabold text-rose-700 border border-rose-200">
                {filteredTasks.filter((t) => t.status === 'pending').length}
              </span>
            </div>

            <div className="mt-3 space-y-3 flex-1 overflow-y-auto">
              {filteredTasks
                .filter((t) => t.status === 'pending')
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-white/90 backdrop-blur-md bg-white/85 p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {task.code}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{task.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <img src={task.assignedToAvatar} alt="" className="h-4 w-4 rounded-full" />
                        <span className="truncate max-w-[90px]">{task.assignedToName}</span>
                      </div>
                      <span className="text-[10px] text-rose-600 font-semibold">{task.dueDate}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUpdatingProgressTask(task);
                        setFormProgress(task.progress);
                      }}
                      className="w-full rounded-xl bg-slate-100/80 py-1.5 text-center text-[11px] font-bold text-slate-700 hover:bg-slate-200/80 transition-colors"
                    >
                      Bắt đầu thực hiện →
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 2: Đang thực hiện (🟡) */}
          <div className="rounded-3xl backdrop-blur-md bg-amber-50/60 border border-amber-200/80 p-4 flex flex-col min-h-[500px] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/70">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse"></span>
                <h3 className="font-bold text-amber-900 text-xs uppercase">Đang thực hiện</h3>
              </div>
              <span className="rounded-full bg-amber-100/90 px-2 py-0.5 text-xs font-extrabold text-amber-700 border border-amber-200">
                {filteredTasks.filter((t) => t.status === 'in_progress').length}
              </span>
            </div>

            <div className="mt-3 space-y-3 flex-1 overflow-y-auto">
              {filteredTasks
                .filter((t) => t.status === 'in_progress')
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-white/90 backdrop-blur-md bg-white/85 p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                        {task.code}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                        <span>Tiến độ</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <img src={task.assignedToAvatar} alt="" className="h-4 w-4 rounded-full" />
                        <span className="truncate max-w-[90px]">{task.assignedToName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Hạn: {task.dueDate}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUpdatingProgressTask(task);
                        setFormProgress(task.progress);
                      }}
                      className="w-full rounded-xl bg-amber-100/80 py-1.5 text-center text-[11px] font-bold text-amber-900 hover:bg-amber-200/80 transition-colors"
                    >
                      Cập nhật tiến độ / Kết quả
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 3: Hoàn thành (🟢) */}
          <div className="rounded-3xl backdrop-blur-md bg-emerald-50/60 border border-emerald-200/80 p-4 flex flex-col min-h-[500px] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/70">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <h3 className="font-bold text-emerald-900 text-xs uppercase">Đã hoàn thành</h3>
              </div>
              <span className="rounded-full bg-emerald-100/90 px-2 py-0.5 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                {filteredTasks.filter((t) => t.status === 'completed').length}
              </span>
            </div>

            <div className="mt-3 space-y-3 flex-1 overflow-y-auto">
              {filteredTasks
                .filter((t) => t.status === 'completed')
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-white/90 backdrop-blur-md bg-white/85 p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {task.code}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-through text-slate-400">
                      {task.title}
                    </h4>

                    {task.resultEvidence && (
                      <p className="text-[10px] text-emerald-700 bg-emerald-50/90 p-1.5 rounded-lg border border-emerald-100">
                        ✓ {task.resultEvidence}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Phụ trách: {task.assignedToName}</span>
                      <span className="text-emerald-700 font-bold">100%</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create & Edit Task (Tổ Trưởng Full Control) */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          if (onCloseCreateModal) onCloseCreateModal();
        }}
        title={editingTask ? 'Chỉnh sửa công việc chuyên môn' : 'Thêm & Phân công công việc mới'}
        subtitle="Thiết lập nội dung, người phụ trách, thời hạn và phân bổ nhiệm vụ trong khối"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên công việc: *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Soạn giáo án thao giảng KPKH Lớp Lớn 1"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Nội dung chi tiết & Yêu cầu: *</label>
            <textarea
              rows={3}
              required
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Mô tả cụ thể mục tiêu, giáo cụ cần chuẩn bị, hình thức thực hiện..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Giáo viên phụ trách chính: *</label>
              <select
                required
                value={formAssignedTo}
                onChange={(e) => setFormAssignedTo(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Chu kỳ công việc:</label>
              <select
                value={formPeriod}
                onChange={(e) => setFormPeriod(e.target.value as TaskPeriod)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              >
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
                <option value="school_year">Theo năm học</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Ngày giao:</label>
              <input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Hạn hoàn thành: *</label>
              <input
                type="date"
                required
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none font-semibold text-rose-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Mức độ ưu tiên:</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              >
                <option value="high">Ưu tiên cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Trạng thái hiện tại:</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              >
                <option value="pending">🔴 Chưa thực hiện</option>
                <option value="in_progress">🟡 Đang thực hiện</option>
                <option value="completed">🟢 Đã hoàn thành</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Tiến độ ({formProgress}%):</label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={formProgress}
                onChange={(e) => setFormProgress(Number(e.target.value))}
                className="mt-2 w-full accent-rose-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Ghi chú hoặc Tên file đính kèm:</label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Ghi chú lưu ý khi thực hiện..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
            >
              {editingTask ? 'Lưu thay đổi' : 'Tạo & Giao việc'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Teacher Quick Progress & Notes Update */}
      {updatingProgressTask && (
        <Modal
          isOpen={true}
          onClose={() => setUpdatingProgressTask(null)}
          title={`Cập nhật tiến độ: ${updatingProgressTask.title}`}
          subtitle={`Phụ trách: ${updatingProgressTask.assignedToName} • Hạn: ${updatingProgressTask.dueDate}`}
          maxWidth="lg"
        >
          <form onSubmit={handleTeacherSaveProgress} className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Tiến độ hoàn thành:</label>
                <span className="text-sm font-extrabold text-rose-600">{formProgress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={formProgress}
                onChange={(e) => setFormProgress(Number(e.target.value))}
                className="mt-2 w-full accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (Chưa làm)</span>
                <span>50% (Đang làm)</span>
                <span>100% (Hoàn thành)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Ghi chú kết quả thực hiện / Minh chứng:</label>
              <textarea
                rows={3}
                value={formEvidence}
                onChange={(e) => setFormEvidence(e.target.value)}
                placeholder="Ví dụ: Đã in xong 20 bộ tranh chữ cái và trang trí tại góc ngôn ngữ lớp Nhỡ 1..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUpdatingProgressTask(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
              >
                Lưu kết quả
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Xóa công việc chuyên môn"
        message={`Bạn có chắc chắn muốn xóa công việc "${taskToDelete?.title}" (${taskToDelete?.code}) không? Thao tác này sẽ cập nhật ngay trong hệ thống và nhật ký của tổ.`}
      />
    </div>
  );
};
