import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Download,
  Eye,
  Edit2,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Plan, PlanType } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface PlansViewProps {
  initialPlanId?: string;
}

export const PlansView: React.FC<PlansViewProps> = ({ initialPlanId }) => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [plans, setPlans] = useState<Plan[]>(() => StorageService.getPlans());
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<Plan | null>(() => {
    if (initialPlanId) {
      return StorageService.getPlans().find((p) => p.id === initialPlanId) || null;
    }
    return null;
  });
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<PlanType>('thang');
  const [formAcademicYear, setFormAcademicYear] = useState('2025 - 2026');
  const [formMonthOrWeek, setFormMonthOrWeek] = useState('Tháng 8/2026');
  const [formContent, setFormContent] = useState('');
  const [formAssignedTo, setFormAssignedTo] = useState(currentUser?.id || '');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [formStatus, setFormStatus] = useState<'draft' | 'in_progress' | 'approved' | 'completed'>('in_progress');
  const [formNotes, setFormNotes] = useState('');

  const typeLabels: Record<PlanType, string> = {
    nam_hoc: 'Kế hoạch năm học',
    thang: 'Kế hoạch tháng',
    tuan: 'Kế hoạch tuần',
    chuyen_de: 'Kế hoạch chuyên đề',
    thao_giang: 'Kế hoạch thao giảng',
    du_gio: 'Kế hoạch dự giờ',
    hoat_dong_gd: 'Kế hoạch HĐ giáo dục',
    khac: 'Kế hoạch khác',
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      if (selectedType !== 'all' && p.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchContent = p.content.toLowerCase().includes(q);
        const matchAssigned = p.assignedToName.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchAssigned) return false;
      }
      return true;
    });
  }, [plans, selectedType, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setFormTitle('');
    setFormType('thang');
    setFormAcademicYear('2025 - 2026');
    setFormMonthOrWeek('Tháng 8/2026');
    setFormContent('');
    setFormAssignedTo(currentUser?.id || allUsers[0]?.id || '');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setFormStatus('in_progress');
    setFormNotes('');
    setIsPlanModalOpen(true);
  };

  const handleOpenEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormTitle(plan.title);
    setFormType(plan.type);
    setFormAcademicYear(plan.academicYear);
    setFormMonthOrWeek(plan.monthOrWeek || '');
    setFormContent(plan.content);
    setFormAssignedTo(plan.assignedTo);
    setFormStartDate(plan.startDate);
    setFormEndDate(plan.endDate);
    setFormStatus(plan.status);
    setFormNotes(plan.notes || '');
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const assignedUser = allUsers.find((u) => u.id === formAssignedTo);

    if (editingPlan) {
      const updated = plans.map((p) => {
        if (p.id === editingPlan.id) {
          return {
            ...p,
            title: formTitle,
            type: formType,
            academicYear: formAcademicYear,
            monthOrWeek: formMonthOrWeek,
            content: formContent,
            assignedTo: formAssignedTo,
            assignedToName: assignedUser?.name || p.assignedToName,
            startDate: formStartDate,
            endDate: formEndDate,
            status: formStatus,
            notes: formNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      StorageService.savePlans(updated);
      setPlans(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'update',
          'plan',
          formTitle,
          `Chỉnh sửa kế hoạch chuyên môn (${typeLabels[formType]})`
        );
      }
    } else {
      const newPlan: Plan = {
        id: `plan-${Date.now()}`,
        title: formTitle,
        type: formType,
        academicYear: formAcademicYear,
        monthOrWeek: formMonthOrWeek,
        content: formContent,
        assignedTo: formAssignedTo,
        assignedToName: assignedUser?.name || 'Tổ chuyên môn',
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        notes: formNotes,
        createdBy: currentUser?.id || 'admin',
        createdByName: currentUser?.name || 'Tổ trưởng',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newPlan, ...plans];
      StorageService.savePlans(updated);
      setPlans(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'create',
          'plan',
          newPlan.title,
          `Đã tạo kế hoạch mới (${typeLabels[newPlan.type]})`
        );
      }
    }

    setIsPlanModalOpen(false);
  };

  const handleDeletePlan = () => {
    if (!planToDelete) return;
    const updated = plans.filter((p) => p.id !== planToDelete.id);
    StorageService.savePlans(updated);
    setPlans(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'plan',
        planToDelete.title,
        `Đã xóa kế hoạch chuyên môn`
      );
    }
    setPlanToDelete(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📑 Kế hoạch chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lưu trữ và quản lý kế hoạch năm học, tháng, tuần, chuyên đề, thao giảng, dự giờ Khối B
          </p>
        </div>

        {isLeader && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-300/40 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo kế hoạch mới</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md bg-white/60 p-3.5 rounded-3xl border border-white/80 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên kế hoạch, nội dung, người phụ trách..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none w-full sm:w-56"
        >
          <option value="all">📂 Phân loại: Tất cả kế hoạch</option>
          <option value="nam_hoc">Kế hoạch năm học</option>
          <option value="thang">Kế hoạch tháng</option>
          <option value="tuan">Kế hoạch tuần</option>
          <option value="chuyen_de">Kế hoạch chuyên đề</option>
          <option value="thao_giang">Kế hoạch thao giảng</option>
          <option value="du_gio">Kế hoạch dự giờ</option>
          <option value="hoat_dong_gd">Kế hoạch HĐ giáo dục</option>
          <option value="khac">Kế hoạch khác</option>
        </select>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 backdrop-blur-md bg-white/60 rounded-3xl border border-white/80 p-6 shadow-xs">
            <FileSpreadsheet className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Chưa có kế hoạch nào phù hợp.</p>
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 p-5 shadow-sm hover:shadow-lg hover:border-white/95 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-full bg-purple-100/80 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200 backdrop-blur-xs">
                    {typeLabels[plan.type]}
                  </span>
                  <span className="rounded-full bg-blue-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200 backdrop-blur-xs">
                    {plan.academicYear}
                  </span>
                </div>

                <h3
                  onClick={() => setViewingPlan(plan)}
                  className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                >
                  {plan.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed whitespace-pre-line">
                  {plan.content}
                </p>

                <div className="mt-4 pt-3 border-t border-white/60 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Phụ trách:</span>
                    <span className="font-semibold text-slate-700">{plan.assignedToName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Thời gian:</span>
                    <span>
                      {plan.startDate} ~ {plan.endDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setViewingPlan(plan)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-4 w-4" />
                  <span>Xem chi tiết</span>
                </button>

                {isLeader && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(plan)}
                      className="rounded-xl p-1.5 text-slate-500 hover:bg-white/80 transition-colors"
                      title="Sửa kế hoạch"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanToDelete(plan)}
                      className="rounded-xl p-1.5 text-rose-500 hover:bg-white/80 transition-colors"
                      title="Xóa kế hoạch"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: View Plan Details */}
      {viewingPlan && (
        <Modal
          isOpen={true}
          onClose={() => setViewingPlan(null)}
          title={viewingPlan.title}
          subtitle={`Phân loại: ${typeLabels[viewingPlan.type]} • Năm học: ${viewingPlan.academicYear}`}
          maxWidth="3xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block">Người phụ trách:</span>
                <strong className="text-slate-800">{viewingPlan.assignedToName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Thời gian:</span>
                <strong className="text-slate-800">{viewingPlan.startDate} ~ {viewingPlan.endDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Trạng thái:</span>
                <strong className="text-emerald-700">{viewingPlan.status === 'in_progress' ? 'Đang triển khai' : 'Hoàn tất'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Người lập:</span>
                <strong className="text-slate-800">{viewingPlan.createdByName}</strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 mb-1">Nội dung chi tiết kế hoạch:</h4>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
                {viewingPlan.content}
              </div>
            </div>

            {viewingPlan.notes && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Ghi chú bổ sung:</strong> {viewingPlan.notes}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingPlan(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create & Edit Plan */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title={editingPlan ? 'Chỉnh sửa kế hoạch chuyên môn' : 'Tạo kế hoạch chuyên môn mới'}
        subtitle="Lập kế hoạch công tác, phân công nhiệm vụ và thời gian triển khai"
        maxWidth="3xl"
      >
        <form onSubmit={handleSavePlan} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên kế hoạch: *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Kế hoạch công tác chuyên môn Tháng 9/2026"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Loại kế hoạch:</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as PlanType)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
              >
                <option value="nam_hoc">Kế hoạch năm học</option>
                <option value="thang">Kế hoạch tháng</option>
                <option value="tuan">Kế hoạch tuần</option>
                <option value="chuyen_de">Kế hoạch chuyên đề</option>
                <option value="thao_giang">Kế hoạch thao giảng</option>
                <option value="du_gio">Kế hoạch dự giờ</option>
                <option value="hoat_dong_gd">Kế hoạch HĐ giáo dục</option>
                <option value="khac">Kế hoạch khác</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Năm học:</label>
              <input
                type="text"
                value={formAcademicYear}
                onChange={(e) => setFormAcademicYear(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Người phụ trách:</label>
              <select
                value={formAssignedTo}
                onChange={(e) => setFormAssignedTo(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Ngày bắt đầu:</label>
              <input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Ngày kết thúc:</label>
              <input
                type="date"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Nội dung chi tiết: *</label>
            <textarea
              rows={6}
              required
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="1. Mục đích - yêu cầu&#10;2. Nội dung trọng tâm&#10;3. Phân công thực hiện&#10;4. Biện pháp triển khai..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs"
            >
              {editingPlan ? 'Lưu thay đổi' : 'Tạo kế hoạch'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(planToDelete)}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleDeletePlan}
        title="Xóa kế hoạch chuyên môn"
        message={`Bạn có chắc chắn muốn xóa kế hoạch "${planToDelete?.title}" không?`}
      />
    </div>
  );
};
