import React from 'react';
import { TaskStatus, TaskPriority, UserRole, PlanType, LessonDomain, DigitalLessonType } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus | 'draft' | 'approved' | 'in_progress' | 'completed' | 'pending';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  switch (status) {
    case 'completed':
      return (
        <span
          id={`badge-status-completed`}
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses[size]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Hoàn thành
        </span>
      );
    case 'in_progress':
      return (
        <span
          id={`badge-status-in_progress`}
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses[size]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Đang thực hiện
        </span>
      );
    case 'pending':
    case 'draft':
      return (
        <span
          id={`badge-status-pending`}
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses[size]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
          Chưa thực hiện
        </span>
      );
    case 'approved':
      return (
        <span
          id={`badge-status-approved`}
          className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          Đã phê duyệt
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
};

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  switch (priority) {
    case 'high':
      return (
        <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/10">
          Ưu tiên cao
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
          Trung bình
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
          Thấp
        </span>
      );
  }
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  if (role === 'to_truong' || role === 'leader') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 border border-purple-200">
        ⭐ Tổ trưởng
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 border border-teal-200">
      👩‍🏫 Giáo viên
    </span>
  );
};

export const DomainBadge: React.FC<{ domain: LessonDomain }> = ({ domain }) => {
  const domainMap: Record<LessonDomain, { label: string; bg: string; text: string }> = {
    the_chat: { label: 'PT Thể chất', bg: 'bg-orange-50', text: 'text-orange-700' },
    nhan_thuc: { label: 'PT Nhận thức', bg: 'bg-blue-50', text: 'text-blue-700' },
    ngon_ngu: { label: 'PT Ngôn ngữ', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    tinh_cam_knxh: { label: 'Tình cảm - KNXH', bg: 'bg-pink-50', text: 'text-pink-700' },
    tham_my: { label: 'PT Thẩm mỹ', bg: 'bg-violet-50', text: 'text-violet-700' },
    ngoai_troi: { label: 'HĐ Ngoài trời', bg: 'bg-amber-50', text: 'text-amber-700' },
    hoat_dong_goc: { label: 'HĐ Góc', bg: 'bg-cyan-50', text: 'text-cyan-700' },
    hoat_dong_chieu: { label: 'HĐ Chiều', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    khac: { label: 'Hoạt động khác', bg: 'bg-slate-50', text: 'text-slate-700' },
  };

  const item = domainMap[domain] || domainMap.khac;
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${item.bg} ${item.text} border border-black/5`}>
      {item.label}
    </span>
  );
};

export const FormatBadge: React.FC<{ format?: DigitalLessonType }> = ({ format = 'canva' }) => {
  switch (format) {
    case 'canva':
      return (
        <span className="inline-flex items-center rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-900 border border-cyan-300">
          🎨 Canva Interactive
        </span>
      );
    case 'powerpoint':
      return (
        <span className="inline-flex items-center rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-900 border border-orange-300">
          📊 PowerPoint
        </span>
      );
    case 'video':
      return (
        <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-900 border border-rose-300">
          🎬 Video Clip
        </span>
      );
    case 'pdf':
      return (
        <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-900 border border-purple-300">
          📄 PDF Slide
        </span>
      );
    case 'interactive':
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-300">
          🕹️ Tương tác
        </span>
      );
  }
};
