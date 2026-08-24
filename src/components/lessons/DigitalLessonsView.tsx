import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Download,
  Video,
  Presentation,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Eye,
  Star,
  Play,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { DigitalLesson, DigitalLessonFormat } from '../../types';
import { FormatBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const DigitalLessonsView: React.FC = () => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [digitalLessons, setDigitalLessons] = useState<DigitalLesson[]>(() =>
    StorageService.getDigitalLessons()
  );

  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingLesson, setViewingLesson] = useState<DigitalLesson | null>(null);
  const [editingLesson, setEditingLesson] = useState<DigitalLesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<DigitalLesson | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formFormat, setFormFormat] = useState<DigitalLessonFormat>('canva');
  const [formTopic, setFormTopic] = useState('');
  const [formAgeGroup, setFormAgeGroup] = useState('5 - 6 tuổi (Lớp Lớn)');
  const [formAuthorId, setFormAuthorId] = useState(currentUser?.id || '');
  const [formUrl, setFormUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');

  const filtered = useMemo(() => {
    return digitalLessons.filter((item) => {
      if (selectedFormat !== 'all' && item.format !== selectedFormat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchTopic = item.topic.toLowerCase().includes(q);
        const matchAuthor = item.authorName.toLowerCase().includes(q);
        if (!matchTitle && !matchTopic && !matchAuthor) return false;
      }
      return true;
    });
  }, [digitalLessons, selectedFormat, searchQuery]);

  const handleOpenCreate = () => {
    setEditingLesson(null);
    setFormTitle('');
    setFormFormat('canva');
    setFormTopic('Thế giới Động vật');
    setFormAgeGroup('5 - 6 tuổi');
    setFormAuthorId(currentUser?.id || allUsers[0]?.id || '');
    setFormUrl('https://canva.com/design/sample-lesson');
    setFormDescription('');
    setFormThumbnail('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson: DigitalLesson) => {
    setEditingLesson(lesson);
    setFormTitle(lesson.title);
    setFormFormat(lesson.format);
    setFormTopic(lesson.topic);
    setFormAgeGroup(lesson.ageGroup);
    setFormAuthorId(lesson.authorId);
    setFormUrl(lesson.url);
    setFormDescription(lesson.description || '');
    setFormThumbnail(lesson.thumbnailUrl || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const author = allUsers.find((u) => u.id === formAuthorId);

    if (editingLesson) {
      const updated = digitalLessons.map((l) => {
        if (l.id === editingLesson.id) {
          return {
            ...l,
            title: formTitle,
            format: formFormat,
            topic: formTopic,
            ageGroup: formAgeGroup,
            authorId: formAuthorId,
            authorName: author?.name || l.authorName,
            url: formUrl,
            description: formDescription,
            thumbnailUrl:
              formThumbnail ||
              'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
            updatedAt: new Date().toISOString(),
          };
        }
        return l;
      });

      StorageService.saveDigitalLessons(updated);
      setDigitalLessons(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'update',
          'digital_lesson',
          formTitle,
          `Đã cập nhật bài giảng điện tử (${formFormat.toUpperCase()})`
        );
      }
    } else {
      const newItem: DigitalLesson = {
        id: `dl-${Date.now()}`,
        title: formTitle,
        format: formFormat,
        topic: formTopic,
        ageGroup: formAgeGroup,
        authorId: formAuthorId,
        authorName: author?.name || currentUser?.name || 'Giáo viên',
        url: formUrl,
        thumbnailUrl:
          formThumbnail ||
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
        viewsCount: 1,
        likesCount: 0,
        description: formDescription,
        createdBy: currentUser?.id || 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newItem, ...digitalLessons];
      StorageService.saveDigitalLessons(updated);
      setDigitalLessons(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'upload',
          'digital_lesson',
          newItem.title,
          `Đã đăng tải bài giảng điện tử mới (${formFormat.toUpperCase()})`
        );
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!lessonToDelete) return;
    const updated = digitalLessons.filter((l) => l.id !== lessonToDelete.id);
    StorageService.saveDigitalLessons(updated);
    setDigitalLessons(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'digital_lesson',
        lessonToDelete.title,
        `Đã xóa bài giảng điện tử`
      );
    }
    setLessonToDelete(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>✨ Kho giáo án điện tử & Bài giảng tương tác</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lưu trữ bài giảng Canva, PowerPoint tương tác, video minh họa và tài liệu số hóa cho trẻ mầm non
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-2xl bg-pink-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-pink-300/40 hover:bg-pink-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm bài giảng số</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 backdrop-blur-md bg-white/60 p-3.5 rounded-3xl border border-white/80 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên bài, chủ đề, người thiết kế..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-pink-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-pink-500 focus:outline-none"
        >
          <option value="all">🎨 Định dạng: Tất cả định dạng</option>
          <option value="canva">Thiết kế Canva</option>
          <option value="powerpoint">PowerPoint (.pptx)</option>
          <option value="video">Video bài dạy / Hoạt hình</option>
          <option value="pdf">Tài liệu PDF điện tử</option>
          <option value="image">Tranh ảnh trực quan</option>
        </select>
      </div>

      {/* Digital Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 backdrop-blur-md bg-white/60 rounded-3xl border border-white/80 p-6 shadow-xs">
            <Presentation className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Chưa có bài giảng điện tử nào phù hợp.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 overflow-hidden shadow-sm hover:shadow-lg hover:border-white/95 transition-all group"
            >
              <div>
                {/* Thumbnail image with format badge */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <FormatBadge format={item.format} />
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {item.ageGroup}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-pink-600 font-semibold">
                    <span>Chủ đề: {item.topic}</span>
                    <span className="text-slate-400">👁 {item.viewsCount} lượt xem</span>
                  </div>

                  <h3
                    onClick={() => setViewingLesson(item)}
                    className="font-extrabold text-slate-900 text-sm group-hover:text-pink-600 transition-colors cursor-pointer line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description || 'Bài giảng tương tác sinh động với hình ảnh và âm thanh thu hút trẻ.'}
                  </p>

                  <div className="pt-2 border-t border-white/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Thiết kế: <strong className="text-slate-700">{item.authorName}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-pink-100/80 backdrop-blur-md py-2 text-xs font-bold text-pink-800 hover:bg-pink-200/80 transition-colors border border-pink-200"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Mở bài giảng</span>
                </a>

                {(isLeader || currentUser?.id === item.authorId) && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="rounded-xl p-2 text-slate-500 hover:bg-white/80 transition-colors"
                      title="Sửa bài giảng"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonToDelete(item)}
                      className="rounded-xl p-2 text-rose-500 hover:bg-white/80 transition-colors"
                      title="Xóa bài giảng"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: View Digital Lesson */}
      {viewingLesson && (
        <Modal
          isOpen={true}
          onClose={() => setViewingLesson(null)}
          title={viewingLesson.title}
          subtitle={`Chủ đề: ${viewingLesson.topic} • Độ tuổi: ${viewingLesson.ageGroup}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <img
                src={viewingLesson.thumbnailUrl}
                alt={viewingLesson.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block">Định dạng:</span>
                <FormatBadge format={viewingLesson.format} />
              </div>
              <div>
                <span className="text-slate-400 block">Người thiết kế:</span>
                <strong className="text-slate-800">{viewingLesson.authorName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Lượt xem:</span>
                <strong className="text-slate-800">{viewingLesson.viewsCount}</strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 mb-1">Mô tả bài giảng:</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                {viewingLesson.description || 'Bài giảng điện tử hỗ trợ giảng dạy trực quan trên lớp học mầm non.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <a
                href={viewingLesson.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white hover:bg-pink-700 shadow-xs"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Mở link bài giảng trực tuyến</span>
              </a>

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

      {/* Modal: Create & Edit Digital Lesson */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLesson ? 'Chỉnh sửa bài giảng điện tử' : 'Thêm bài giảng điện tử mới'}
        subtitle="Chia sẻ bài giảng Canva, PowerPoint, Video cho đồng nghiệp trong tổ"
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên bài giảng điện tử: *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Trò chơi toán học tương tác: Đếm số lượng trong phạm vi 5"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Định dạng file / ứng dụng:</label>
              <select
                value={formFormat}
                onChange={(e) => setFormFormat(e.target.value as DigitalLessonFormat)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-pink-500 focus:outline-none"
              >
                <option value="canva">Canva</option>
                <option value="powerpoint">PowerPoint (.pptx)</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="image">Tranh ảnh</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Chủ đề:</label>
              <input
                type="text"
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                placeholder="Ví dụ: Thế giới Động vật"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Độ tuổi:</label>
              <input
                type="text"
                value={formAgeGroup}
                onChange={(e) => setFormAgeGroup(e.target.value)}
                placeholder="Ví dụ: 5 - 6 tuổi"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Người thiết kế:</label>
              <select
                value={formAuthorId}
                onChange={(e) => setFormAuthorId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-pink-500 focus:outline-none"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Link liên kết trực tuyến (Canva / Google Drive / Youtube): *</label>
            <input
              type="url"
              required
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://canva.com/design/... hoặc https://drive.google.com/..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Mô tả bài giảng & Hướng dẫn sử dụng:</label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Mô tả các hiệu ứng tương tác, câu hỏi đố vui trong slide..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Link ảnh bìa đại diện (Thumbnail):</label>
            <input
              type="text"
              value={formThumbnail}
              onChange={(e) => setFormThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-pink-500 focus:outline-none"
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
              className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 shadow-xs"
            >
              {editingLesson ? 'Lưu thay đổi' : 'Lưu bài giảng'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(lessonToDelete)}
        onClose={() => setLessonToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa bài giảng điện tử"
        message={`Bạn có chắc muốn xóa bài giảng "${lessonToDelete?.title}" không?`}
      />
    </div>
  );
};
