import React from 'react';
import {
  Home,
  CheckSquare,
  BarChart2,
  FileSpreadsheet,
  BookOpen,
  Presentation,
  FolderArchive,
  MessageSquareHeart,
  Calendar,
  Megaphone,
  PieChart,
  Users,
  History,
  Settings,
  Sparkles,
  ChevronRight,
  School,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  leadOnly?: boolean;
}

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  pendingTasksCount?: number;
  unassignedTasksCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount = 0,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { isLeader, currentUser } = useAuth();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    {
      id: 'tasks',
      label: 'Công việc chuyên môn',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'progress-table', label: 'Bảng theo dõi tiến độ', icon: BarChart2 },
    { id: 'plans', label: 'Kế hoạch chuyên môn', icon: FileSpreadsheet },
    { id: 'lessons', label: 'Kho giáo án', icon: BookOpen },
    { id: 'digital-lessons', label: 'Giáo án điện tử', icon: Presentation },
    { id: 'documents', label: 'Tài liệu chuyên môn', icon: FolderArchive },
    { id: 'discussions', label: 'Trao đổi chuyên môn', icon: MessageSquareHeart },
    { id: 'calendar', label: 'Lịch công tác', icon: Calendar },
    { id: 'announcements', label: 'Thông báo của tổ', icon: Megaphone },
    { id: 'reports', label: 'Báo cáo & Thống kê', icon: PieChart },
    { id: 'members', label: 'Quản lý thành viên', icon: Users },
    { id: 'activity-logs', label: 'Nhật ký thao tác', icon: History },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 md:w-68 backdrop-blur-xl bg-white/50 border-r border-white/60 shadow-lg shadow-blue-950/5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Info Banner */}
        <div className="p-3 border-b border-white/40">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 text-xs font-semibold text-blue-900 shadow-xs">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <School className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="block font-bold text-slate-800 truncate">Khối B (Nhỡ & Lớn)</span>
              <span className="text-[10px] text-blue-600 font-medium">Năm học 2025 - 2026</span>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Danh mục quản lý
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'backdrop-blur-md bg-white/85 text-blue-700 font-bold border border-white/90 shadow-xs'
                    : 'text-slate-700 hover:bg-white/40 hover:text-blue-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-rose-500 text-white'
                          : item.badgeColor || 'bg-white/60 text-slate-700 border border-white/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Card at bottom */}
        <div className="p-3 border-t border-white/40">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 shadow-xs">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-2xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-blue-600 font-semibold uppercase truncate">
                {isLeader ? 'Tổ trưởng chuyên môn' : currentUser?.classAssigned || 'Giáo viên Khối B'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
