import React, { useState, useMemo, useEffect } from 'react';
import { Search, CheckSquare, FileSpreadsheet, BookOpen, Presentation, FolderArchive, Megaphone, MessageSquareHeart, ArrowRight, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { StorageService } from '../../services/storage';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string, itemId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const allData = useMemo(() => {
    return {
      tasks: StorageService.getTasks(),
      plans: StorageService.getPlans(),
      lessons: StorageService.getLessons(),
      digitalLessons: StorageService.getDigitalLessons(),
      documents: StorageService.getDocuments(),
      announcements: StorageService.getAnnouncements(),
      discussions: StorageService.getDiscussions(),
    };
  }, [isOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      tab: string;
      icon: React.ElementType;
      badge: string;
      badgeColor: string;
    }> = [];

    // Search tasks
    allData.tasks.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignedToName.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q)
      ) {
        results.push({
          id: t.id,
          title: `[${t.code}] ${t.title}`,
          subtitle: `Phụ trách: ${t.assignedToName} • Hạn: ${t.dueDate}`,
          category: 'Công việc',
          tab: 'tasks',
          icon: CheckSquare,
          badge: t.status === 'completed' ? 'Hoàn thành' : t.status === 'in_progress' ? 'Đang làm' : 'Chưa làm',
          badgeColor: t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
        });
      }
    });

    // Search plans
    allData.plans.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)) {
        results.push({
          id: p.id,
          title: p.title,
          subtitle: `Phụ trách: ${p.assignedToName} • Thời gian: ${p.startDate} ~ ${p.endDate}`,
          category: 'Kế hoạch',
          tab: 'plans',
          icon: FileSpreadsheet,
          badge: p.type,
          badgeColor: 'bg-blue-100 text-blue-800',
        });
      }
    });

    // Search lesson plans
    allData.lessons.forEach((l) => {
      if (
        l.title.toLowerCase().includes(q) ||
        l.topic.toLowerCase().includes(q) ||
        l.teacherName.toLowerCase().includes(q)
      ) {
        results.push({
          id: l.id,
          title: l.title,
          subtitle: `Chủ đề: ${l.topic} • GV: ${l.teacherName} (${l.ageGroup})`,
          category: 'Giáo án',
          tab: 'lessons',
          icon: BookOpen,
          badge: l.domain,
          badgeColor: 'bg-purple-100 text-purple-800',
        });
      }
    });

    // Search digital lessons
    allData.digitalLessons.forEach((dl) => {
      if (dl.title.toLowerCase().includes(q) || dl.description.toLowerCase().includes(q)) {
        results.push({
          id: dl.id,
          title: dl.title,
          subtitle: `Định dạng: ${dl.type.toUpperCase()} • Tác giả: ${dl.creatorName}`,
          category: 'Giáo án điện tử',
          tab: 'digital-lessons',
          icon: Presentation,
          badge: dl.type.toUpperCase(),
          badgeColor: 'bg-pink-100 text-pink-800',
        });
      }
    });

    // Search documents
    allData.documents.forEach((d) => {
      if (
        d.title.toLowerCase().includes(q) ||
        (d.code && d.code.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q))
      ) {
        results.push({
          id: d.id,
          title: d.title,
          subtitle: `Ban hành: ${d.issuer || 'Khối B'} • Số hiệu: ${d.code || '---'}`,
          category: 'Tài liệu',
          tab: 'documents',
          icon: FolderArchive,
          badge: d.category,
          badgeColor: 'bg-indigo-100 text-indigo-800',
        });
      }
    });

    // Search announcements
    allData.announcements.forEach((a) => {
      if (a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)) {
        results.push({
          id: a.id,
          title: a.title,
          subtitle: `Đăng bởi: ${a.authorName} • Ngày: ${new Date(a.createdAt).toLocaleDateString('vi-VN')}`,
          category: 'Thông báo',
          tab: 'announcements',
          icon: Megaphone,
          badge: a.isImportant ? 'Khẩn' : 'Thông báo',
          badgeColor: a.isImportant ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800',
        });
      }
    });

    // Search discussions
    allData.discussions.forEach((disc) => {
      if (disc.title.toLowerCase().includes(q) || disc.content.toLowerCase().includes(q)) {
        results.push({
          id: disc.id,
          title: disc.title,
          subtitle: `Tác giả: ${disc.authorName} • Bình luận: ${disc.commentsCount}`,
          category: 'Trao đổi',
          tab: 'discussions',
          icon: MessageSquareHeart,
          badge: disc.category,
          badgeColor: 'bg-teal-100 text-teal-800',
        });
      }
    });

    return results.slice(0, 15);
  }, [query, allData]);

  const handleSelect = (item: (typeof searchResults)[0]) => {
    onNavigate(item.tab, item.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tìm kiếm toàn bộ ứng dụng Khối B"
      subtitle="Tìm công việc, kế hoạch, giáo án, bài giảng Canva/PPT, tài liệu, thông báo..."
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
          <input
            id="input-global-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập từ khóa tìm kiếm (Ví dụ: Thao giảng, Thể chất, Vòng đời bướm, Công văn 112...)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-10 text-sm text-slate-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm">Gõ ít nhất 1 từ khóa để tra cứu dữ liệu chuyên môn toàn khối.</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">Không tìm thấy nội dung phù hợp với "{query}".</p>
              <p className="text-xs text-slate-400 mt-1">Thử tìm theo tên giáo viên, chủ đề, mã công việc hoặc lĩnh vực.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {searchResults.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.tab}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="flex cursor-pointer items-center justify-between p-3 rounded-xl hover:bg-rose-50/60 transition-colors group"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-800 truncate group-hover:text-rose-600">
                            {item.title}
                          </p>
                          <span className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-3">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider hidden sm:inline">
                        {item.category}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
