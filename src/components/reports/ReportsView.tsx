import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Printer,
  Calendar,
  Award,
  BookOpen,
  FolderArchive,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';

export const ReportsView: React.FC = () => {
  const { allUsers } = useAuth();
  const [tasks] = useState(() => StorageService.getTasks());
  const [lessons] = useState(() => StorageService.getLessons());
  const [digitalLessons] = useState(() => StorageService.getDigitalLessons());
  const [documents] = useState(() => StorageService.getDocuments());

  const [periodFilter, setPeriodFilter] = useState<'all' | 'monthly' | 'weekly'>('all');

  // Summary Metrics
  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate,
      totalLessons: lessons.length,
      totalDigitalLessons: digitalLessons.length,
      totalDocs: documents.length,
    };
  }, [tasks, lessons, digitalLessons, documents]);

  // Pie chart data for task status
  const pieData = useMemo(() => {
    return [
      { name: 'Hoàn thành (Xanh)', value: summary.completed, color: '#10b981' },
      { name: 'Đang làm (Vàng)', value: summary.inProgress, color: '#f59e0b' },
      { name: 'Chưa làm (Đỏ)', value: summary.pending, color: '#ef4444' },
    ];
  }, [summary]);

  // Teacher Performance data for BarChart
  const teacherPerformanceData = useMemo(() => {
    return allUsers.map((u) => {
      const userTasks = tasks.filter((t) => t.assignedTo === u.id);
      const userCompleted = userTasks.filter((t) => t.status === 'completed').length;
      const userInProgress = userTasks.filter((t) => t.status === 'in_progress').length;
      const userPending = userTasks.filter((t) => t.status === 'pending').length;
      const userLessons = lessons.filter((l) => l.teacherId === u.id).length;
      const rate = userTasks.length > 0 ? Math.round((userCompleted / userTasks.length) * 100) : 0;

      return {
        name: u.name.split(' ').pop() || u.name, // Short name for chart
        fullName: u.name,
        tongViec: userTasks.length,
        hoanThanh: userCompleted,
        dangLam: userInProgress,
        chuaLam: userPending,
        giaoAn: userLessons,
        rate,
      };
    });
  }, [allUsers, tasks, lessons]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCSV = () => {
    const headers = ['Giáo viên', 'Tổng số việc', 'Đã hoàn thành', 'Đang thực hiện', 'Chưa thực hiện', 'Tỉ lệ HT (%)', 'Giáo án đã nộp'];
    const rows = teacherPerformanceData.map((d) => [
      `"${d.fullName}"`,
      d.tongViec,
      d.hoanThanh,
      d.dangLam,
      d.chuaLam,
      `${d.rate}%`,
      d.giaoAn,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_cao_tong_ket_chuyen_mon_Khoi_B_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📈 Báo cáo & Thống kê chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu hoạt động chuyên môn, hiệu suất công việc và lưu trữ học liệu Khối B
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportSummaryCSV}
            className="flex items-center gap-1.5 rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-white shadow-xs transition-all"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Xuất báo cáo tổng kết</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-rose-300/40 hover:bg-rose-700 active:scale-95 transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>In báo cáo</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl backdrop-blur-md bg-white/65 p-5 border border-white/80 shadow-sm hover:shadow-md transition-all">
          <span className="text-xs font-semibold text-slate-500">Tổng công việc khối</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{summary.total}</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Đạt {summary.completionRate}% hoàn thành</span>
          </div>
        </div>

        <div className="rounded-3xl backdrop-blur-md bg-white/65 p-5 border border-white/80 shadow-sm hover:shadow-md transition-all">
          <span className="text-xs font-semibold text-slate-500">Giáo án đã lưu trữ</span>
          <p className="text-3xl font-extrabold text-purple-700 mt-2">{summary.totalLessons}</p>
          <span className="text-[11px] text-slate-400 mt-2 block">5 lĩnh vực phát triển</span>
        </div>

        <div className="rounded-3xl backdrop-blur-md bg-white/65 p-5 border border-white/80 shadow-sm hover:shadow-md transition-all">
          <span className="text-xs font-semibold text-slate-500">Bài giảng điện tử</span>
          <p className="text-3xl font-extrabold text-pink-600 mt-2">{summary.totalDigitalLessons}</p>
          <span className="text-[11px] text-slate-400 mt-2 block">Canva, PPTX, Video</span>
        </div>

        <div className="rounded-3xl backdrop-blur-md bg-white/65 p-5 border border-white/80 shadow-sm hover:shadow-md transition-all">
          <span className="text-xs font-semibold text-slate-500">Văn bản & Biểu mẫu</span>
          <p className="text-3xl font-extrabold text-cyan-600 mt-2">{summary.totalDocs}</p>
          <span className="text-[11px] text-slate-400 mt-2 block">Văn bản chỉ đạo & Sổ sách</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bar chart of teacher tasks */}
        <div className="lg:col-span-8 rounded-3xl backdrop-blur-md bg-white/65 p-6 border border-white/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Tiến độ hoàn thành công việc theo từng giáo viên
            </h3>
            <span className="text-xs text-slate-400">Đơn vị: Số lượng công việc</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === 'hoanThanh'
                      ? 'Hoàn thành'
                      : name === 'dangLam'
                      ? 'Đang làm'
                      : 'Chưa làm',
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === 'hoanThanh'
                      ? 'Hoàn thành (Xanh)'
                      : value === 'dangLam'
                      ? 'Đang làm (Vàng)'
                      : 'Chưa làm (Đỏ)'
                  }
                />
                <Bar dataKey="hoanThanh" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dangLam" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="chuaLam" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie chart of overall status */}
        <div className="lg:col-span-4 rounded-3xl backdrop-blur-md bg-white/65 p-6 border border-white/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Tỷ lệ trạng thái công việc khối</h3>
            <p className="text-xs text-slate-400 mt-0.5">Phân bổ theo màu sắc quy ước</p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-white/60 pt-3 text-xs">
            <div className="flex items-center justify-between text-emerald-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
                Hoàn thành
              </span>
              <span>{summary.completed} việc ({summary.completionRate}%)</span>
            </div>

            <div className="flex items-center justify-between text-amber-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-xs"></span>
                Đang thực hiện
              </span>
              <span>{summary.inProgress} việc</span>
            </div>

            <div className="flex items-center justify-between text-rose-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-xs"></span>
                Chưa thực hiện
              </span>
              <span>{summary.pending} việc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Performance Breakdown Table */}
      <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/80 bg-white/50 backdrop-blur-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Bảng chi tiết hiệu suất & Giáo án của giáo viên</h3>
          </div>
          <span className="text-xs text-slate-500">Khối B - Trường Mầm non Vỹ Dạ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/60 backdrop-blur-xs border-b border-white/80 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Giáo viên</th>
                <th className="py-3 px-3 text-center">Tổng việc</th>
                <th className="py-3 px-3 text-center text-emerald-700">Đã xong</th>
                <th className="py-3 px-3 text-center text-amber-700">Đang làm</th>
                <th className="py-3 px-3 text-center text-rose-700">Chưa làm</th>
                <th className="py-3 px-4 min-w-[150px]">Tỉ lệ hoàn thành</th>
                <th className="py-3 px-3 text-center">Giáo án đã nộp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {teacherPerformanceData.map((d, idx) => (
                <tr key={idx} className="hover:bg-white/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{d.fullName}</td>
                  <td className="py-3.5 px-3 text-center font-semibold text-slate-700">{d.tongViec}</td>
                  <td className="py-3.5 px-3 text-center font-bold text-emerald-700">{d.hoanThanh}</td>
                  <td className="py-3.5 px-3 text-center font-bold text-amber-700">{d.dangLam}</td>
                  <td className="py-3.5 px-3 text-center font-bold text-rose-700">{d.chuaLam}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${d.rate}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-slate-800 min-w-[28px] text-right">
                        {d.rate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-purple-700">{d.giaoAn} bài</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
