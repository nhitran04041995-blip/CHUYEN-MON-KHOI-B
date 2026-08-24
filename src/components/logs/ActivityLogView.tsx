import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Calendar,
  User,
  CheckCircle2,
  FileSpreadsheet,
  BookOpen,
  FolderArchive,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { ActivityLog } from '../../types';

export const ActivityLogView: React.FC = () => {
  const { isLeader, allUsers } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>(() => StorageService.getActivityLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('all');

  const filteredLogs = logs.filter((log) => {
    if (selectedEntity !== 'all' && log.targetEntity !== selectedEntity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUser = log.userName.toLowerCase().includes(q);
      const matchTitle = log.targetTitle.toLowerCase().includes(q);
      const matchDetails = log.details?.toLowerCase().includes(q);
      if (!matchUser && !matchTitle && !matchDetails) return false;
    }
    return true;
  });

  const handleClearLogs = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử thao tác?')) {
      StorageService.saveActivityLogs([]);
      setLogs([]);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Tạo mới</span>;
      case 'update':
        return <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">Cập nhật</span>;
      case 'delete':
        return <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">Đã xóa</span>;
      case 'status_change':
        return <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">Đổi trạng thái</span>;
      case 'progress_update':
        return <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">Báo tiến độ</span>;
      case 'upload':
        return <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800">Tải lên</span>;
      default:
        return <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800">{action}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📜 Nhật ký thao tác & Hoạt động chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận toàn bộ thời gian, người thực hiện và nội dung thay đổi trên hệ thống để đảm bảo tính minh bạch
          </p>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-white shadow-xs transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span>Xóa lịch sử</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 backdrop-blur-md bg-white/60 p-3.5 rounded-3xl border border-white/80 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo người thao tác, nội dung thay đổi..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-rose-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-rose-500 focus:outline-none"
        >
          <option value="all">📂 Tất cả đối tượng</option>
          <option value="task">Công việc chuyên môn</option>
          <option value="plan">Kế hoạch</option>
          <option value="lesson">Giáo án</option>
          <option value="digital_lesson">Bài giảng điện tử</option>
          <option value="document">Tài liệu / Văn bản</option>
          <option value="announcement">Thông báo</option>
          <option value="discussion">Diễn đàn trao đổi</option>
          <option value="calendar">Lịch công tác</option>
          <option value="system">Hệ thống & Nhân sự</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/60 backdrop-blur-xs border-b border-white/80 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 min-w-[170px]">Thời gian</th>
                <th className="py-3.5 px-4 min-w-[170px]">Người thực hiện</th>
                <th className="py-3.5 px-3 min-w-[120px]">Hành động</th>
                <th className="py-3.5 px-4 min-w-[240px]">Nội dung / Đối tượng</th>
                <th className="py-3.5 px-4 min-w-[220px]">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Chưa có nhật ký nào được ghi lại.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {log.timestamp.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={log.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'}
                          alt={log.userName}
                          className="h-6 w-6 rounded-full object-cover shadow-2xs"
                        />
                        <span className="font-semibold text-slate-800">{log.userName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">{getActionBadge(log.action)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{log.targetTitle}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {log.details || '-'}
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
