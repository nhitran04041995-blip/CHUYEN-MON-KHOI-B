import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
  Shield,
  Menu,
  X,
  Plus,
  FileText,
  BookOpen,
  Send,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { AppNotification } from '../../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenQuickTaskModal: () => void;
  onNavigate: (tab: string) => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenQuickTaskModal,
  onNavigate,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const { currentUser, role, isLeader, allUsers, switchUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const notifs = StorageService.getNotifications();
    setNotifications(notifs);

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead(currentUser?.id);
    setNotifications(StorageService.getNotifications());
  };

  const handleNotifClick = (notif: AppNotification) => {
    if (notif.linkTab) {
      onNavigate(notif.linkTab);
    }
    setShowNotifMenu(false);
  };

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/50 bg-white/45 px-4 md:px-6 backdrop-blur-xl transition-all shadow-xs"
    >
      {/* Left: Mobile toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-mobile-sidebar"
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden rounded-xl p-2 text-slate-700 backdrop-blur-md bg-white/50 border border-white/80 hover:bg-white/80 transition-colors shadow-2xs"
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 text-white shadow-md shadow-blue-500/20 font-bold text-lg">
            🌸
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm md:text-base font-extrabold text-blue-900 leading-tight tracking-tight uppercase">
              KHỐI B - TRƯỜNG MẦM NON VỸ DẠ
            </h1>
            <p className="text-xs text-slate-600 font-medium line-clamp-1 italic underline decoration-blue-300 decoration-2">
              "Kết nối chuyên môn - Chia sẻ trách nhiệm - Đồng hành hiệu quả"
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Global Search bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          id="btn-search-trigger"
          type="button"
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-2xl border border-white/80 backdrop-blur-md bg-white/60 px-4 py-2 text-xs md:text-sm text-slate-500 hover:border-blue-300 hover:bg-white/80 hover:text-slate-700 transition-all shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-blue-500" />
            <span>Tìm kiếm công việc, giáo án, tài liệu, kế hoạch...</span>
          </div>
          <kbd className="hidden lg:inline-block rounded-lg bg-white/80 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-white">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Quick Add, Notifications, Role Switcher, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Action Button for Tổ Trưởng / Giáo Viên */}
        {isLeader && (
          <button
            id="btn-header-quick-add-task"
            type="button"
            onClick={onOpenQuickTaskModal}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-300/40 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Giao việc mới</span>
          </button>
        )}

        {/* Mobile Search Button */}
        <button
          id="btn-mobile-search"
          type="button"
          onClick={onOpenSearch}
          className="md:hidden rounded-xl p-2 text-slate-600 backdrop-blur-md bg-white/60 border border-white/80 hover:bg-white/80"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            id="btn-header-notifications"
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative rounded-xl p-2 text-slate-700 backdrop-blur-md bg-white/60 border border-white/80 hover:bg-white/80 hover:text-slate-900 transition-colors shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div
              id="header-notif-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl backdrop-blur-2xl bg-white/85 p-4 shadow-2xl border border-white/90 z-50 animate-fade-in"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Thông báo & Nhắc việc</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Đã đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/40 py-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">Không có thông báo nào</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`flex cursor-pointer gap-3 p-2.5 rounded-2xl hover:bg-white/60 transition-colors ${
                        !notif.isRead ? 'bg-blue-50/50 border border-blue-100/60' : ''
                      }`}
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-xs">
                        🔔
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{notif.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(notif.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-200/60 pt-3 text-center">
                <button
                  onClick={() => {
                    onNavigate('announcements');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Xem tất cả thông báo của Tổ →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Role Switcher Dropdown for ease of testing */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="btn-header-user-menu"
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 p-1.5 sm:px-3 sm:py-1.5 hover:bg-white/80 transition-all shadow-xs"
          >
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
              }
              alt={currentUser?.name}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
            />
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 line-clamp-1">{currentUser?.name}</span>
                {isLeader ? (
                  <span className="rounded-full bg-purple-100 px-2 py-0.2 text-[9px] font-extrabold text-purple-700 uppercase">
                    Tổ trưởng
                  </span>
                ) : (
                  <span className="rounded-full bg-teal-50 px-2 py-0.2 text-[9px] font-semibold text-teal-700">
                    Giáo viên
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{currentUser?.email}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Profile & Switch Teacher Dropdown */}
          {showUserMenu && (
            <div
              id="header-user-dropdown"
              className="absolute right-0 mt-2 w-72 rounded-3xl backdrop-blur-2xl bg-white/85 p-3.5 shadow-2xl border border-white/90 z-50 animate-fade-in"
            >
              <div className="p-2 border-b border-slate-200/60">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-xs text-slate-500">{currentUser?.title}</p>
                <p className="text-[11px] text-blue-600 font-medium mt-0.5">{currentUser?.email}</p>
              </div>

              {/* Fast Switch Teacher Account (Multi-user demo testing) */}
              <div className="py-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-blue-600" />
                  Chuyển nhanh tài khoản giáo viên:
                </p>
                <div className="space-y-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs text-left transition-colors ${
                        currentUser?.id === u.id
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70'
                          : 'hover:bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={u.avatar} alt={u.name} className="h-5 w-5 rounded-full object-cover" />
                        <span className="truncate">{u.name}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/70 text-slate-600 font-medium">
                        {u.role === 'to_truong' ? 'Tổ trưởng' : 'GV'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200/60 pt-2 space-y-1">
                <button
                  onClick={() => {
                    onNavigate('members');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-slate-700 hover:bg-white/60 font-medium"
                >
                  <Shield className="h-4 w-4 text-slate-400" />
                  Quản lý tổ viên & Phân quyền
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-bold"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất tài khoản
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
