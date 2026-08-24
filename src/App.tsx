import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginView } from './components/auth/LoginView';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { TaskProgressTable } from './components/tasks/TaskProgressTable';
import { PlansView } from './components/plans/PlansView';
import { LessonPlansView } from './components/lessons/LessonPlansView';
import { DigitalLessonsView } from './components/lessons/DigitalLessonsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { DiscussionsView } from './components/discussions/DiscussionsView';
import { CalendarView } from './components/calendar/CalendarView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { ReportsView } from './components/reports/ReportsView';
import { MembersView } from './components/members/MembersView';
import { ActivityLogView } from './components/logs/ActivityLogView';
import { SettingsView } from './components/settings/SettingsView';

export function App() {
  const { isAuthenticated, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Quick Action Modal flags across tabs
  const [isQuickCreateTaskOpen, setIsQuickCreateTaskOpen] = useState(false);
  const [isQuickCreateLessonOpen, setIsQuickCreateLessonOpen] = useState(false);
  const [isQuickCreateDocOpen, setIsQuickCreateDocOpen] = useState(false);
  const [isQuickCreateAnnounceOpen, setIsQuickCreateAnnounceOpen] = useState(false);

  // Deep linking item targets
  const [targetItemId, setTargetItemId] = useState<string | undefined>(undefined);

  // If not authenticated, display the clear LoginView
  if (!isAuthenticated || !currentUser) {
    return <LoginView />;
  }

  const handleNavigate = (tab: string, itemId?: string) => {
    setActiveTab(tab);
    setTargetItemId(itemId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={handleNavigate}
            onOpenTaskModal={() => {
              setActiveTab('tasks');
              setIsQuickCreateTaskOpen(true);
            }}
            onOpenLessonModal={() => {
              setActiveTab('lessons');
              setIsQuickCreateLessonOpen(true);
            }}
            onOpenDocModal={() => {
              setActiveTab('documents');
              setIsQuickCreateDocOpen(true);
            }}
            onOpenAnnouncementModal={() => {
              setActiveTab('announcements');
              setIsQuickCreateAnnounceOpen(true);
            }}
          />
        );

      case 'tasks':
        return (
          <TasksView
            initialTaskId={targetItemId}
            isCreateOpen={isQuickCreateTaskOpen}
            onCloseCreateModal={() => setIsQuickCreateTaskOpen(false)}
          />
        );

      case 'progress-table':
        return <TaskProgressTable />;

      case 'plans':
        return <PlansView initialPlanId={targetItemId} />;

      case 'lessons':
        return (
          <LessonPlansView
            initialLessonId={targetItemId}
            isCreateOpen={isQuickCreateLessonOpen}
            onCloseCreateModal={() => setIsQuickCreateLessonOpen(false)}
          />
        );

      case 'digital-lessons':
        return <DigitalLessonsView />;

      case 'documents':
        return (
          <DocumentsView
            isCreateOpen={isQuickCreateDocOpen}
            onCloseCreateModal={() => setIsQuickCreateDocOpen(false)}
          />
        );

      case 'discussions':
        return <DiscussionsView />;

      case 'calendar':
        return <CalendarView />;

      case 'announcements':
        return (
          <AnnouncementsView
            isCreateOpen={isQuickCreateAnnounceOpen}
            onCloseCreateModal={() => setIsQuickCreateAnnounceOpen(false)}
          />
        );

      case 'reports':
        return <ReportsView />;

      case 'members':
        return <MembersView />;

      case 'logs':
        return <ActivityLogView />;

      case 'settings':
        return <SettingsView />;

      default:
        return <DashboardView onNavigate={handleNavigate} onOpenTaskModal={() => {}} onOpenLessonModal={() => {}} onOpenDocModal={() => {}} onOpenAnnouncementModal={() => {}} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 md:lg:pl-68">
        {/* Top Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenQuickTaskModal={() => {
            setActiveTab('tasks');
            setIsQuickCreateTaskOpen(true);
          }}
          onNavigate={handleNavigate}
          onToggleMobileSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileSidebarOpen={isMobileMenuOpen}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Quick Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
export default App;
