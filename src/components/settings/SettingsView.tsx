import React, { useState } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RefreshCw,
  School,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Database,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { AppSettings } from '../../types';

export const SettingsView: React.FC = () => {
  const { currentUser, isLeader } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [appName, setAppName] = useState(settings.appName);
  const [appSlogan, setAppSlogan] = useState(settings.appSlogan);
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [blockName, setBlockName] = useState(settings.blockName);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(settings.currentAcademicYear);
  const [currentSemester, setCurrentSemester] = useState(settings.currentSemester);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      appName,
      appSlogan,
      schoolName,
      blockName,
      currentAcademicYear,
      currentSemester,
    };

    StorageService.saveSettings(updated);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'update',
        'system',
        'Cài đặt hệ thống',
        'Cập nhật thông tin đơn vị và năm học'
      );
    }
  };

  const handleExportBackup = () => {
    const backupData = StorageService.exportAllData();
    const element = document.createElement('a');
    const file = new Blob([backupData], { type: 'application/json;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Backup_Khoi_B_MN_Vy_Da_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const success = StorageService.importAllData(json);
        if (success) {
          alert('Đã phục hồi dữ liệu thành công! Trang web sẽ tự động tải lại.');
          window.location.reload();
        } else {
          alert('Tệp dữ liệu không hợp lệ. Vui lòng kiểm tra lại định dạng JSON.');
        }
      } catch (err) {
        alert('Lỗi khi đọc tệp sao lưu.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ dữ liệu về trạng thái mẫu ban đầu của Khối B - MN Vỹ Dạ. Bạn có chắc chắn muốn tiếp tục?'
      )
    ) {
      StorageService.resetToSeedData();
      alert('Đã khôi phục dữ liệu mẫu thành công!');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title Bar */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span>⚙️ Cài đặt hệ thống & Cấu hình tổ chuyên môn</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Tùy chỉnh thông tin trường học, niên khóa, quy ước chuyên môn và sao lưu dữ liệu toàn diện
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-100/80 border border-emerald-300 backdrop-blur-md p-4 text-emerald-800 text-xs font-bold shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>Cập nhật cấu hình hệ thống thành công!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Box 1: Thông tin đơn vị */}
        <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/60">
            <School className="h-5 w-5 text-rose-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Thông tin đơn vị & Khối chuyên môn</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Tên khối chuyên môn:</label>
              <input
                type="text"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-3 py-2 text-xs focus:border-rose-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Tên đơn vị trường học:</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-3 py-2 text-xs focus:border-rose-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Tên ứng dụng hiển thị:</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-3 py-2 text-xs focus:border-rose-500 focus:bg-white focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Khẩu hiệu / Slogan chuyên môn:</label>
            <input
              type="text"
              value={appSlogan}
              onChange={(e) => setAppSlogan(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-3 py-2 text-xs focus:border-rose-500 focus:bg-white focus:outline-none italic"
            />
          </div>
        </div>

        {/* Box 2: Niên khóa & Thời gian */}
        <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/60">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Cấu hình Niên khóa & Học kỳ</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Năm học hiện tại:</label>
              <input
                type="text"
                value={currentAcademicYear}
                onChange={(e) => setCurrentAcademicYear(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-3 py-2 text-xs focus:border-rose-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Học kỳ:</label>
              <select
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-3 py-2 text-xs focus:border-rose-500 focus:bg-white focus:outline-none"
              >
                <option value="Học kỳ 1">Học kỳ 1</option>
                <option value="Học kỳ 2">Học kỳ 2</option>
                <option value="Hè">Hoạt động Hè</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button for Leader */}
        {isLeader && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-rose-300/40 hover:bg-rose-700 active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Lưu cấu hình hệ thống</span>
            </button>
          </div>
        )}
      </form>

      {/* Box 3: Backup, Restore & Reset */}
      <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/60">
          <Database className="h-5 w-5 text-indigo-600" />
          <h3 className="font-extrabold text-slate-900 text-sm">Quản lý dữ liệu & Sao lưu (Backup / Restore)</h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Xuất toàn bộ cơ sở dữ liệu (công việc, kế hoạch, giáo án, tài liệu, thông báo, thảo luận) ra tệp JSON để lưu trữ an toàn hoặc nhập lại khi chuyển đổi máy tính.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-100/80 border border-indigo-200 backdrop-blur-md px-4 py-3 text-xs font-bold text-indigo-900 hover:bg-indigo-200/80 transition-colors shadow-xs"
          >
            <Download className="h-4 w-4 text-indigo-700" />
            <span>Sao lưu dữ liệu (JSON)</span>
          </button>

          {/* Import */}
          <label className="flex items-center justify-center gap-2 rounded-2xl bg-teal-100/80 border border-teal-200 backdrop-blur-md px-4 py-3 text-xs font-bold text-teal-900 hover:bg-teal-200/80 transition-colors cursor-pointer shadow-xs">
            <Upload className="h-4 w-4 text-teal-700" />
            <span>Phục hồi từ file</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          {/* Reset */}
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center justify-center gap-2 rounded-2xl bg-rose-100/80 border border-rose-200 backdrop-blur-md px-4 py-3 text-xs font-bold text-rose-900 hover:bg-rose-200/80 transition-colors shadow-xs"
          >
            <RefreshCw className="h-4 w-4 text-rose-700" />
            <span>Khôi phục dữ liệu mẫu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
