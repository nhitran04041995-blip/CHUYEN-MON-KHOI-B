import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Search,
  Filter,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Task, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';

export const TaskProgressTable: React.FC = () => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks());
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshTasks = () => {
    setTasks(StorageService.getTasks());
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedTeacher !== 'all' && t.assignedTo !== selectedTeacher) return false;
      if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchTeacher = t.assignedToName.toLowerCase().includes(q);
        const matchCode = t.code.toLowerCase().includes(q);
        if (!matchTitle && !matchTeacher && !matchCode) return false;
      }
      return true;
    });
  }, [tasks, selectedTeacher, selectedStatus, searchQuery]);

  // Statistics calculation for the progress board
  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((t) => t.status === 'completed').length;
    const inProgress = filteredTasks.filter((t) => t.status === 'in_progress').length;
    const pending = filteredTasks.filter((t) => t.status === 'pending').length;
    const avgProgress =
      total > 0
        ? Math.round(filteredTasks.reduce((acc, curr) => acc + curr.progress, 0) / total)
        : 0;

    return { total, completed, inProgress, pending, avgProgress };
  }, [filteredTasks]);

  // Quick 1-click status update from table
  const handleStatusToggle = (taskId: string, newStatus: TaskStatus) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const newProgress = newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 50 : 0;
        const taskUpdated = {
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
            `Bảng tiến độ: chuyển sang "${newStatus === 'completed' ? 'Hoàn thành' : newStatus === 'in_progress' ? 'Đang thực hiện' : 'Chưa thực hiện'}"`
          );
        }
        return taskUpdated;
      }
      return t;
    });

    StorageService.saveTasks(updated);
    setTasks(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['STT', 'Mã', 'Tên công việc', 'Người phụ trách', 'Thời gian bắt đầu', 'Hạn nộp', 'Trạng thái', 'Tiến độ (%)'];
    const rows = filteredTasks.map((t, idx) => [
      idx + 1,
      t.code,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.assignedToName}"`,
      t.startDate,
      t.dueDate,
      t.status === 'completed' ? 'Hoàn thành' : t.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa thực hiện',
      `${t.progress}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_tien_do_Khoi_B_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📊 Bảng theo dõi tiến độ chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Bảng tổng hợp trực quan giúp Tổ trưởng và giáo viên kiểm soát khối lượng công việc và tiến độ thực tế
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Xuất CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>In bảng tiến độ</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-2xl backdrop-blur-md bg-white/60 p-3.5 border border-white/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500">Tổng công việc</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
        </div>

        <div className="rounded-2xl backdrop-blur-md bg-emerald-50/75 p-3.5 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-bold">🟢 Hoàn thành</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="text-xl font-extrabold text-emerald-800 mt-1">{stats.completed}</p>
        </div>

        <div className="rounded-2xl backdrop-blur-md bg-amber-50/75 p-3.5 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[11px] font-bold">🟡 Đang thực hiện</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-xl font-extrabold text-amber-800 mt-1">{stats.inProgress}</p>
        </div>

        <div className="rounded-2xl backdrop-blur-md bg-rose-50/75 p-3.5 border border-rose-200/80 shadow-xs">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-[11px] font-bold">🔴 Chưa thực hiện</span>
            <AlertCircle className="h-4 w-4" />
          </div>
          <p className="text-xl font-extrabold text-rose-800 mt-1">{stats.pending}</p>
        </div>

        <div className="rounded-2xl backdrop-blur-md bg-blue-50/75 p-3.5 border border-blue-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-blue-800">Tiến độ chung</span>
          <p className="text-xl font-extrabold text-blue-800 mt-1">{stats.avgProgress}%</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md bg-white/60 p-3.5 rounded-3xl border border-white/80 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên công việc, giáo viên..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none w-full sm:w-48"
          >
            <option value="all">👩‍🏫 Tất cả giáo viên</option>
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none w-full sm:w-40"
          >
            <option value="all">⚡ Tất cả trạng thái</option>
            <option value="completed">🟢 Hoàn thành</option>
            <option value="in_progress">🟡 Đang thực hiện</option>
            <option value="pending">🔴 Chưa thực hiện</option>
          </select>
        </div>
      </div>

      {/* Main Table Matching Requirement Section 6 */}
      <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/80 backdrop-blur-md border-b border-white/80 text-blue-950 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-3 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 min-w-[240px]">Công việc</th>
                <th className="py-3.5 px-4 min-w-[180px]">Người phụ trách</th>
                <th className="py-3.5 px-3 min-w-[140px]">Thời gian</th>
                <th className="py-3.5 px-3 min-w-[140px] text-center">Trạng thái</th>
                <th className="py-3.5 px-4 min-w-[180px]">Tiến độ</th>
                <th className="py-3.5 px-3 text-right">Chuyển nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không có công việc nào theo tiêu chí lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, idx) => (
                  <tr
                    key={task.id}
                    className={`transition-colors hover:bg-white/60 ${
                      task.status === 'completed'
                        ? 'bg-emerald-50/30'
                        : task.status === 'in_progress'
                        ? 'bg-amber-50/30'
                        : 'bg-rose-50/30'
                    }`}
                  >
                    {/* STT */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-600">{idx + 1}</td>

                    {/* Công việc */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500 text-[11px]">{task.code}</span>
                        <span className="font-bold text-slate-900">{task.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{task.description}</p>
                    </td>

                    {/* Người phụ trách */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignedToAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'}
                          alt={task.assignedToName}
                          className="h-6 w-6 rounded-full object-cover ring-1 ring-white"
                        />
                        <span className="font-semibold text-slate-800">{task.assignedToName}</span>
                      </div>
                    </td>

                    {/* Thời gian */}
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-800">{task.dueDate}</span>
                      <span className="block text-[10px] text-slate-400">Giao: {task.startDate}</span>
                    </td>

                    {/* Trạng thái (Xanh / Vàng / Đỏ) */}
                    <td className="py-3.5 px-3 text-center">
                      {task.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                          <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                          🟢 Hoàn thành
                        </span>
                      )}
                      {task.status === 'in_progress' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/90 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-300">
                          <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></span>
                          🟡 Đang thực hiện
                        </span>
                      )}
                      {task.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100/90 px-2.5 py-1 text-xs font-bold text-rose-800 border border-rose-300">
                          <span className="h-2 w-2 rounded-full bg-rose-600"></span>
                          🔴 Chưa thực hiện
                        </span>
                      )}
                    </td>

                    {/* Tiến độ % Bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-3 rounded-full bg-slate-200/70 overflow-hidden">
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
                        <span className="font-extrabold text-slate-800 min-w-[32px] text-right">
                          {task.progress}%
                        </span>
                      </div>
                    </td>

                    {/* Quick Status Shift Button */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(task.id, 'completed')}
                          title="Hoàn thành"
                          className="rounded-xl p-1.5 text-emerald-600 hover:bg-white/80 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(task.id, 'in_progress')}
                          title="Đang làm"
                          className="rounded-xl p-1.5 text-amber-600 hover:bg-white/80 transition-colors"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(task.id, 'pending')}
                          title="Chưa làm"
                          className="rounded-xl p-1.5 text-rose-600 hover:bg-white/80 transition-colors"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
