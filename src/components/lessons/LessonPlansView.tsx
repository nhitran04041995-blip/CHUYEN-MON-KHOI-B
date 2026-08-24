import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  User,
  Star,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { LessonPlan, LessonDomain, AgeGroup } from '../../types';
import { DomainBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface LessonPlansViewProps {
  initialLessonId?: string;
  isCreateOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const LessonPlansView: React.FC<LessonPlansViewProps> = ({
  initialLessonId,
  isCreateOpen = false,
  onCloseCreateModal,
}) => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [lessons, setLessons] = useState<LessonPlan[]>(() => StorageService.getLessons());

  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(isCreateOpen);
  const [viewingLesson, setViewingLesson] = useState<LessonPlan | null>(() => {
    if (initialLessonId) {
      return StorageService.getLessons().find((l) => l.id === initialLessonId) || null;
    }
    return null;
  });
  const [editingLesson, setEditingLesson] = useState<LessonPlan | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<LessonPlan | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formAgeGroup, setFormAgeGroup] = useState<AgeGroup>('5_6_tuoi');
  const [formDomain, setFormDomain] = useState<LessonDomain>('nhan_thuc');
  const [formTeacherId, setFormTeacherId] = useState(currentUser?.id || '');
  const [formTeachingDate, setFormTeachingDate] = useState(new Date().toISOString().split('T')[0]);
  const [formContent, setFormContent] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const ageLabels: Record<AgeGroup, string> = {
    '3_4_tuoi': 'Mẫu giáo Bé (3 - 4 tuổi)',
    '4_5_tuoi': 'Mẫu giáo Nhỡ (4 - 5 tuổi)',
    '5_6_tuoi': 'Mẫu giáo Lớn (5 - 6 tuổi)',
    nha_tre: 'Nhà trẻ (24 - 36 tháng)',
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      if (selectedDomain !== 'all' && l.domain !== selectedDomain) return false;
      if (selectedAge !== 'all' && l.ageGroup !== selectedAge) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = l.title.toLowerCase().includes(q);
        const matchTopic = l.topic.toLowerCase().includes(q);
        const matchTeacher = l.teacherName.toLowerCase().includes(q);
        if (!matchTitle && !matchTopic && !matchTeacher) return false;
      }
      return true;
    });
  }, [lessons, selectedDomain, selectedAge, searchQuery]);

  const handleOpenCreate = () => {
    setEditingLesson(null);
    setFormTitle('');
    setFormTopic('Thế giới Động vật');
    setFormAgeGroup('5_6_tuoi');
    setFormDomain('nhan_thuc');
    setFormTeacherId(currentUser?.id || allUsers[0]?.id || '');
    setFormTeachingDate(new Date().toISOString().split('T')[0]);
    setFormContent('');
    setFormFileName('Giao_an_chuyen_mon.docx');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson: LessonPlan) => {
    setEditingLesson(lesson);
    setFormTitle(lesson.title);
    setFormTopic(lesson.topic);
    setFormAgeGroup(lesson.ageGroup);
    setFormDomain(lesson.domain);
    setFormTeacherId(lesson.teacherId);
    setFormTeachingDate(lesson.teachingDate);
    setFormContent(lesson.content || '');
    setFormFileName(lesson.fileName || '');
    setFormNotes(lesson.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const teacher = allUsers.find((u) => u.id === formTeacherId);

    if (editingLesson) {
      const updated = lessons.map((l) => {
        if (l.id === editingLesson.id) {
          return {
            ...l,
            title: formTitle,
            topic: formTopic,
            ageGroup: formAgeGroup,
            domain: formDomain,
            teacherId: formTeacherId,
            teacherName: teacher?.name || l.teacherName,
            teachingDate: formTeachingDate,
            content: formContent,
            fileName: formFileName || l.fileName,
            notes: formNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return l;
      });

      StorageService.saveLessons(updated);
      setLessons(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'update',
          'lesson',
          formTitle,
          `Đã cập nhật thông tin giáo án (${formTopic})`
        );
      }
    } else {
      const newLesson: LessonPlan = {
        id: `lp-${Date.now()}`,
        title: formTitle,
        topic: formTopic,
        ageGroup: formAgeGroup,
        domain: formDomain,
        teacherId: formTeacherId,
        teacherName: teacher?.name || currentUser?.name || 'Giáo viên',
        teachingDate: formTeachingDate,
        content: formContent,
        fileName: formFileName || 'Giao_an_moi.docx',
        fileSize: '850 KB',
        rating: 5,
        viewsCount: 1,
        downloadsCount: 0,
        notes: formNotes,
        createdBy: currentUser?.id || 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newLesson, ...lessons];
      StorageService.saveLessons(updated);
      setLessons(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'upload',
          'lesson',
          newLesson.title,
          `Đã thêm giáo án mới vào kho (${ageLabels[newLesson.ageGroup]})`
        );
      }
    }

    setIsModalOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleDelete = () => {
    if (!lessonToDelete) return;
    const updated = lessons.filter((l) => l.id !== lessonToDelete.id);
    StorageService.saveLessons(updated);
    setLessons(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'lesson',
        lessonToDelete.title,
        `Đã xóa giáo án`
      );
    }
    setLessonToDelete(null);
  };

  const handleDownloadSim = (lesson: LessonPlan) => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `KHỐI B - TRƯỜNG MẦM NON VỸ DẠ\nGIÁO ÁN CHUYÊN MÔN\n\nTên bài dạy: ${lesson.title}\nChủ đề: ${lesson.topic}\nĐộ tuổi: ${ageLabels[lesson.ageGroup]}\nGiáo viên thực hiện: ${lesson.teacherName}\nNgày thực hiện: ${lesson.teachingDate}\n\nNỘI DUNG TIẾN TRÌNH:\n${lesson.content || 'Nội dung giáo án chuẩn theo quy định mầm non.'}`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${lesson.fileName || 'Giao_an_Khoi_B.txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>📚 Thư viện Kho giáo án chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kho giáo án phân loại theo 5 lĩnh vực phát triển & các hoạt động trong ngày của trẻ mầm non
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-rose-300/40 hover:bg-rose-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm giáo án mới</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 backdrop-blur-md bg-white/60 p-3.5 rounded-3xl border border-white/80 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài dạy, chủ đề, giáo viên..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-rose-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-rose-500 focus:outline-none"
        >
          <option value="all">🎨 Lĩnh vực: Tất cả lĩnh vực</option>
          <option value="the_chat">Phát triển Thể chất</option>
          <option value="nhan_thuc">Phát triển Nhận thức</option>
          <option value="ngon_ngu">Phát triển Ngôn ngữ</option>
          <option value="tinh_cam_knxh">Tình cảm & Kỹ năng xã hội</option>
          <option value="tham_my">Phát triển Thẩm mỹ</option>
          <option value="ngoai_troi">Hoạt động ngoài trời</option>
          <option value="hoat_dong_goc">Hoạt động góc</option>
          <option value="hoat_dong_chieu">Hoạt động chiều</option>
          <option value="khac">Hoạt động khác</option>
        </select>

        <select
          value={selectedAge}
          onChange={(e) => setSelectedAge(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-rose-500 focus:outline-none"
        >
          <option value="all">👶 Độ tuổi: Tất cả lứa tuổi</option>
          <option value="5_6_tuoi">Mẫu giáo Lớn (5 - 6 tuổi)</option>
          <option value="4_5_tuoi">Mẫu giáo Nhỡ (4 - 5 tuổi)</option>
          <option value="3_4_tuoi">Mẫu giáo Bé (3 - 4 tuổi)</option>
          <option value="nha_tre">Nhà trẻ (24 - 36 tháng)</option>
        </select>
      </div>

      {/* Lesson Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 backdrop-blur-md bg-white/60 rounded-3xl border border-white/80 p-6 shadow-xs">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Chưa có giáo án nào theo bộ lọc.</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex flex-col justify-between rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 p-5 shadow-sm hover:shadow-lg hover:border-white/95 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <DomainBadge domain={lesson.domain} />
                  <span className="rounded-full bg-slate-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200 backdrop-blur-xs">
                    {ageLabels[lesson.ageGroup]}
                  </span>
                </div>

                <h3
                  onClick={() => setViewingLesson(lesson)}
                  className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-2"
                >
                  {lesson.title}
                </h3>

                <p className="text-xs text-rose-600 font-medium mt-1">
                  Chủ đề: <span className="text-slate-700">{lesson.topic}</span>
                </p>

                <p className="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed">
                  {lesson.content || 'Giáo án hoàn chỉnh kèm đồ dùng trực quan và các bước tổ chức hoạt động.'}
                </p>

                <div className="mt-4 pt-3 border-t border-white/60 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Giáo viên:</span>
                    <strong className="text-slate-700">{lesson.teacherName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ngày dạy:</span>
                    <span>{lesson.teachingDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingLesson(lesson)}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Xem</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadSim(lesson)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                    title="Tải giáo án về máy"
                  >
                    <Download className="h-4 w-4" />
                    <span>Tải về</span>
                  </button>
                </div>

                {(isLeader || currentUser?.id === lesson.teacherId) && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(lesson)}
                      className="rounded-xl p-1.5 text-slate-500 hover:bg-white/80 transition-colors"
                      title="Sửa giáo án"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonToDelete(lesson)}
                      className="rounded-xl p-1.5 text-rose-500 hover:bg-white/80 transition-colors"
                      title="Xóa giáo án"
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

      {/* Modal: View Lesson */}
      {viewingLesson && (
        <Modal
          isOpen={true}
          onClose={() => setViewingLesson(null)}
          title={viewingLesson.title}
          subtitle={`Chủ đề: ${viewingLesson.topic} • ${ageLabels[viewingLesson.ageGroup]}`}
          maxWidth="3xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block">Lĩnh vực:</span>
                <DomainBadge domain={viewingLesson.domain} />
              </div>
              <div>
                <span className="text-slate-400 block">Giáo viên:</span>
                <strong className="text-slate-800">{viewingLesson.teacherName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Ngày thực hiện:</span>
                <strong className="text-slate-800">{viewingLesson.teachingDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Tệp đính kèm:</span>
                <span className="text-blue-600 font-semibold">{viewingLesson.fileName || 'Docx'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 mb-1">Tiến trình hoạt động giáo án:</h4>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
                {viewingLesson.content || 'Nội dung chi tiết giáo án đã được kiểm duyệt và lưu trữ trên hệ thống.'}
              </div>
            </div>

            {viewingLesson.notes && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Ghi chú sau tiết dạy:</strong> {viewingLesson.notes}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDownloadSim(viewingLesson)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Tải tệp giáo án ({viewingLesson.fileSize || '1.2 MB'})</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingLesson(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create & Edit Lesson */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (onCloseCreateModal) onCloseCreateModal();
        }}
        title={editingLesson ? 'Chỉnh sửa giáo án' : 'Thêm giáo án mới vào kho'}
        subtitle="Lưu trữ và chia sẻ giáo án các hoạt động học cho tổ khối mầm non"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên bài dạy / Tên giáo án: *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Khám phá khoa học: Vòng đời của chú bướm nhỏ"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Chủ đề giáo dục: *</label>
              <input
                type="text"
                required
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                placeholder="Ví dụ: Thế giới Thực vật"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Độ tuổi:</label>
              <select
                value={formAgeGroup}
                onChange={(e) => setFormAgeGroup(e.target.value as AgeGroup)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              >
                <option value="5_6_tuoi">Mẫu giáo Lớn (5 - 6 tuổi)</option>
                <option value="4_5_tuoi">Mẫu giáo Nhỡ (4 - 5 tuổi)</option>
                <option value="3_4_tuoi">Mẫu giáo Bé (3 - 4 tuổi)</option>
                <option value="nha_tre">Nhà trẻ (24 - 36 tháng)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Lĩnh vực phát triển:</label>
              <select
                value={formDomain}
                onChange={(e) => setFormDomain(e.target.value as LessonDomain)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              >
                <option value="nhan_thuc">Phát triển Nhận thức</option>
                <option value="the_chat">Phát triển Thể chất</option>
                <option value="ngon_ngu">Phát triển Ngôn ngữ</option>
                <option value="tinh_cam_knxh">Tình cảm & KNXH</option>
                <option value="tham_my">Phát triển Thẩm mỹ</option>
                <option value="ngoai_troi">Hoạt động ngoài trời</option>
                <option value="hoat_dong_goc">Hoạt động góc</option>
                <option value="hoat_dong_chieu">Hoạt động chiều</option>
                <option value="khac">Hoạt động khác</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Giáo viên thực hiện:</label>
              <select
                value={formTeacherId}
                onChange={(e) => setFormTeacherId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Ngày thực hiện:</label>
              <input
                type="date"
                value={formTeachingDate}
                onChange={(e) => setFormTeachingDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Nội dung chi tiết mục tiêu & tiến trình: *</label>
            <textarea
              rows={5}
              required
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="I. MỤC ĐÍCH YÊU CẦU:&#10;1. Kiến thức...&#10;2. Kỹ năng...&#10;3. Thái độ...&#10;&#10;II. CHUẨN BỊ:&#10;&#10;III. TIẾN HÀNH HOẠT ĐỘNG:&#10;1. Ổn định gây hứng thú&#10;2. Nội dung trọng tâm&#10;3. Kết thúc..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Tên tệp đính kèm:</label>
            <input
              type="text"
              value={formFileName}
              onChange={(e) => setFormFileName(e.target.value)}
              placeholder="Giao_an_chi_tiet.docx"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
            >
              {editingLesson ? 'Lưu giáo án' : 'Lưu vào kho'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(lessonToDelete)}
        onClose={() => setLessonToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa giáo án"
        message={`Bạn có chắc muốn xóa giáo án "${lessonToDelete?.title}" khỏi kho không?`}
      />
    </div>
  );
};
