import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Calendar,
  User,
  Eye,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { DocumentItem, DocumentCategory } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface DocumentsViewProps {
  isCreateOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  isCreateOpen = false,
  onCloseCreateModal,
}) => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>(() => StorageService.getDocuments());

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(isCreateOpen);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<DocumentCategory>('van_ban_chi_dao');
  const [formCode, setFormCode] = useState('');
  const [formIssuedBy, setFormIssuedBy] = useState('Trường Mầm non Vỹ Dạ');
  const [formIssuedDate, setFormIssuedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formFileName, setFormFileName] = useState('');

  const categoryLabels: Record<string, string> = {
    van_ban_chi_dao: 'Văn bản chỉ đạo các cấp',
    thong_tu_huong_dan: 'Thông tư, Hướng dẫn của Bộ/Sở',
    tai_lieu_tap_huan: 'Tài liệu tập huấn bồi dưỡng',
    tap_huan: 'Tài liệu tập huấn bồi dưỡng',
    chuong_trinh_gdmn: 'Chương trình GDMN',
    chuyen_de: 'Chuyên đề chuyên môn',
    tham_khao: 'Tài liệu tham khảo',
    bieu_mau: 'Biểu mẫu, Sổ sách chuyên môn',
    bieu_mau_so_sach: 'Biểu mẫu, Sổ sách chuyên môn',
    sang_kien_kinh_nghiem: 'Sáng kiến kinh nghiệm hay',
    media: 'Hình ảnh, Video tư liệu',
    khac: 'Tài liệu tham khảo khác',
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchDesc = doc.description?.toLowerCase().includes(q);
        const matchCode = doc.documentCode?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCode) return false;
      }
      return true;
    });
  }, [documents, selectedCategory, searchQuery]);

  const handleOpenCreate = () => {
    setEditingDoc(null);
    setFormTitle('');
    setFormCategory('van_ban_chi_dao');
    setFormCode('05/KH-MNVD');
    setFormIssuedBy('Trường Mầm non Vỹ Dạ');
    setFormIssuedDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormFileName('Van_ban_huong_dan.pdf');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormCode(doc.documentCode || '');
    setFormIssuedBy(doc.issuedBy || '');
    setFormIssuedDate(doc.issuedDate || '');
    setFormDescription(doc.description || '');
    setFormFileName(doc.fileName || '');
    setIsModalOpen(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingDoc) {
      const updated = documents.map((d) => {
        if (d.id === editingDoc.id) {
          return {
            ...d,
            title: formTitle,
            category: formCategory,
            documentCode: formCode,
            issuedBy: formIssuedBy,
            issuedDate: formIssuedDate,
            description: formDescription,
            fileName: formFileName || d.fileName,
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      });

      StorageService.saveDocuments(updated);
      setDocuments(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'update',
          'document',
          formTitle,
          `Đã cập nhật văn bản chuyên môn`
        );
      }
    } else {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: formTitle,
        category: formCategory,
        documentCode: formCode,
        issuedBy: formIssuedBy,
        issuedDate: formIssuedDate,
        description: formDescription,
        fileName: formFileName || 'Tai_lieu.pdf',
        fileSize: '1.4 MB',
        fileType: formFileName.endsWith('.xlsx') || formFileName.endsWith('.xls') ? 'xlsx' : 'pdf',
        uploaderId: currentUser?.id || 'admin',
        uploaderName: currentUser?.name || 'Tổ trưởng',
        uploadedBy: currentUser?.id || 'admin',
        uploadedByName: currentUser?.name || 'Tổ trưởng',
        downloadsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newDoc, ...documents];
      StorageService.saveDocuments(updated);
      setDocuments(updated);

      if (currentUser) {
        StorageService.addActivityLog(
          currentUser,
          'upload',
          'document',
          newDoc.title,
          `Đã lưu trữ văn bản/biểu mẫu mới (${categoryLabels[newDoc.category]})`
        );
      }
    }

    setIsModalOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleDelete = () => {
    if (!docToDelete) return;
    const updated = documents.filter((d) => d.id !== docToDelete.id);
    StorageService.saveDocuments(updated);
    setDocuments(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'document',
        docToDelete.title,
        `Đã xóa tài liệu khỏi kho`
      );
    }
    setDocToDelete(null);
  };

  const handleDownloadSim = (doc: DocumentItem) => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `KHỐI B - TRƯỜNG MẦM NON VỸ DẠ\nTÀI LIỆU CHUYÊN MÔN\n\nTiêu đề: ${doc.title}\nSố hiệu: ${doc.documentCode || 'N/A'}\nCơ quan ban hành: ${doc.issuedBy || 'N/A'}\nNgày ban hành: ${doc.issuedDate || 'N/A'}\nPhân loại: ${categoryLabels[doc.category]}\n\nNỘI DUNG / TRÍCH YẾU:\n${doc.description || 'Văn bản hướng dẫn chuyên môn theo chuẩn giáo dục mầm non.'}`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${doc.fileName || 'Tai_lieu_Khoi_B.txt'}`;
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
            <span>🗂️ Kho tài liệu & Biểu mẫu chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lưu trữ văn bản chỉ đạo, thông tư, tài liệu tập huấn, biểu mẫu sổ sách và sáng kiến kinh nghiệm
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-2xl bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-cyan-300/40 hover:bg-cyan-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Tải tài liệu lên kho</span>
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
            placeholder="Tìm theo tiêu đề, số hiệu, cơ quan ban hành..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-cyan-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">📂 Tất cả danh mục tài liệu</option>
          <option value="van_ban_chi_dao">Văn bản chỉ đạo các cấp</option>
          <option value="thong_tu_huong_dan">Thông tư, Hướng dẫn của Bộ/Sở</option>
          <option value="tai_lieu_tap_huan">Tài liệu tập huấn bồi dưỡng</option>
          <option value="bieu_mau_so_sach">Biểu mẫu, Sổ sách chuyên môn</option>
          <option value="sang_kien_kinh_nghiem">Sáng kiến kinh nghiệm hay</option>
          <option value="khac">Tài liệu tham khảo khác</option>
        </select>
      </div>

      {/* Documents List */}
      <div className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/80 backdrop-blur-md border-b border-white/80 text-blue-950 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 min-w-[260px]">Tên văn bản / Tài liệu</th>
                <th className="py-3.5 px-3 min-w-[150px]">Danh mục</th>
                <th className="py-3.5 px-3 min-w-[120px]">Số hiệu / Cơ quan</th>
                <th className="py-3.5 px-3 min-w-[100px]">Ngày BH</th>
                <th className="py-3.5 px-3 min-w-[120px]">Người tải lên</th>
                <th className="py-3.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Không có tài liệu nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/60 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-100/80 text-cyan-700 font-bold border border-cyan-200">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p
                            onClick={() => setViewingDoc(doc)}
                            className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors cursor-pointer"
                          >
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {doc.description || doc.fileName} • {doc.fileSize}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="rounded-full bg-cyan-100/80 px-2.5 py-0.5 text-[10px] font-bold text-cyan-800 border border-cyan-200 backdrop-blur-xs">
                        {categoryLabels[doc.category]}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-800">{doc.documentCode || '-'}</span>
                      <span className="block text-[10px] text-slate-400">{doc.issuedBy || '-'}</span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">{doc.issuedDate || '-'}</td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium">{doc.uploadedByName}</td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingDoc(doc)}
                          className="rounded-xl p-1.5 text-cyan-600 hover:bg-white/80 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadSim(doc)}
                          className="rounded-xl p-1.5 text-blue-600 hover:bg-white/80 transition-colors"
                          title="Tải tệp"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        {(isLeader || currentUser?.id === doc.uploadedBy) && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(doc)}
                              className="rounded-xl p-1.5 text-slate-500 hover:bg-white/80 transition-colors"
                              title="Sửa tài liệu"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDocToDelete(doc)}
                              className="rounded-xl p-1.5 text-rose-500 hover:bg-white/80 transition-colors"
                              title="Xóa tài liệu"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Document */}
      {viewingDoc && (
        <Modal
          isOpen={true}
          onClose={() => setViewingDoc(null)}
          title={viewingDoc.title}
          subtitle={`Số hiệu: ${viewingDoc.documentCode || 'N/A'} • Cơ quan ban hành: ${viewingDoc.issuedBy || 'N/A'}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block">Danh mục:</span>
                <strong className="text-cyan-800">{categoryLabels[viewingDoc.category]}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Ngày ban hành:</span>
                <strong className="text-slate-800">{viewingDoc.issuedDate || 'Chưa cập nhật'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Người đăng tải:</span>
                <strong className="text-slate-800">{viewingDoc.uploadedByName}</strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 mb-1">Trích yếu nội dung:</h4>
              <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-line">
                {viewingDoc.description || 'Văn bản và hướng dẫn thực hiện nhiệm vụ chuyên môn.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDownloadSim(viewingDoc)}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Tải tệp văn bản ({viewingDoc.fileSize || '1.2 MB'})</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create & Edit Document */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (onCloseCreateModal) onCloseCreateModal();
        }}
        title={editingDoc ? 'Chỉnh sửa tài liệu' : 'Tải tài liệu mới lên kho'}
        subtitle="Lưu trữ văn bản chỉ đạo, thông tư, biểu mẫu chuyên môn cho tổ khối"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveDoc} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên văn bản / Tài liệu: *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Kế hoạch số 05/KH-MNVD về thực hiện nhiệm vụ năm học"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Danh mục tài liệu:</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as DocumentCategory)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="van_ban_chi_dao">Văn bản chỉ đạo các cấp</option>
                <option value="thong_tu_huong_dan">Thông tư, Hướng dẫn của Bộ/Sở</option>
                <option value="tai_lieu_tap_huan">Tài liệu tập huấn bồi dưỡng</option>
                <option value="bieu_mau_so_sach">Biểu mẫu, Sổ sách chuyên môn</option>
                <option value="sang_kien_kinh_nghiem">Sáng kiến kinh nghiệm hay</option>
                <option value="khac">Tài liệu tham khảo khác</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Số hiệu văn bản:</label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="Ví dụ: 05/KH-MNVD"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Cơ quan ban hành:</label>
              <input
                type="text"
                value={formIssuedBy}
                onChange={(e) => setFormIssuedBy(e.target.value)}
                placeholder="Ví dụ: Trường Mầm non Vỹ Dạ"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Ngày ban hành:</label>
              <input
                type="date"
                value={formIssuedDate}
                onChange={(e) => setFormIssuedDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Trích yếu nội dung văn bản:</label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Tóm tắt nội dung chính cần phổ biến trong tổ khối..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Tên file đính kèm:</label>
            <input
              type="text"
              value={formFileName}
              onChange={(e) => setFormFileName(e.target.value)}
              placeholder="Van_ban_huong_dan.pdf"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
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
              className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 shadow-xs"
            >
              {editingDoc ? 'Lưu tài liệu' : 'Tải lên kho'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(docToDelete)}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa tài liệu"
        message={`Bạn có chắc muốn xóa tài liệu "${docToDelete?.title}" khỏi kho không?`}
      />
    </div>
  );
};
