import React, { useState, useMemo } from 'react';
import {
  MessageSquareHeart,
  Plus,
  Search,
  Heart,
  MessageCircle,
  Send,
  Sparkles,
  Pin,
  Tag,
  Paperclip,
  Share2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { DiscussionPost, DiscussionCategory, DiscussionComment } from '../../types';
import { Modal } from '../common/Modal';

export const DiscussionsView: React.FC = () => {
  const { currentUser, isLeader, allUsers } = useAuth();
  const [posts, setPosts] = useState<DiscussionPost[]>(() => StorageService.getDiscussions());

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Active commenting
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Create Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<DiscussionCategory>('do_dung_do_choi');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('Khối B, Mầm non Vỹ Dạ');

  const categoryLabels: Record<string, string> = {
    phuong_phap_gd: 'Phương pháp giáo dục mới',
    lam_do_dung_do_choi: 'Làm đồ dùng đồ chơi tự tạo',
    do_dung_do_choi: 'Đồ dùng - Thiết bị mầm non',
    thao_go_kho_khan: 'Tháo gỡ khó khăn trong lớp',
    kinh_nghiem_hay: 'Chia sẻ kinh nghiệm hay',
    cau_hoi: 'Thắc mắc & Giải đáp',
    y_tuong: 'Sáng kiến kinh nghiệm',
    kinh_nghiem: 'Kinh nghiệm giảng dạy',
    de_xuat: 'Đề xuất đổi mới',
    ho_tro: 'Hỗ trợ chuyên môn',
    chia_se: 'Chia sẻ học liệu',
    khac: 'Trao đổi chuyên môn chung',
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchContent = p.content.toLowerCase().includes(q);
        const matchAuthor = p.authorName.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchAuthor) return false;
      }
      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const hasLiked = p.likedBy.includes(currentUser.id);
        const newLikedBy = hasLiked
          ? p.likedBy.filter((id) => id !== currentUser.id)
          : [...p.likedBy, currentUser.id];
        return {
          ...p,
          likesCount: newLikedBy.length,
          likedBy: newLikedBy,
        };
      }
      return p;
    });

    StorageService.saveDiscussions(updated);
    setPosts(updated);
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    const newComment: DiscussionComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: commentText.trim(),
      createdAt: 'Vừa xong',
      likesCount: 0,
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      }
      return p;
    });

    StorageService.saveDiscussions(updated);
    setPosts(updated);
    setCommentText('');

    StorageService.addActivityLog(
      currentUser,
      'comment',
      'discussion',
      posts.find((p) => p.id === postId)?.title || 'Chủ đề',
      `Đã để lại bình luận chia sẻ chuyên môn`
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !currentUser) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      content: formContent,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      isPinned: false,
      likesCount: 1,
      likedBy: [currentUser.id],
      comments: [],
      tags: tagsArray,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newPost, ...posts];
    StorageService.saveDiscussions(updated);
    setPosts(updated);

    StorageService.addActivityLog(
      currentUser,
      'create',
      'discussion',
      newPost.title,
      `Tạo chủ đề thảo luận mới (${categoryLabels[newPost.category]})`
    );

    setIsCreateModalOpen(false);
    setFormTitle('');
    setFormContent('');
  };

  const handleDeletePost = (postId: string) => {
    const postToDelete = posts.find((p) => p.id === postId);
    if (!postToDelete) return;
    const updated = posts.filter((p) => p.id !== postId);
    StorageService.saveDiscussions(updated);
    setPosts(updated);

    if (currentUser) {
      StorageService.addActivityLog(
        currentUser,
        'delete',
        'discussion',
        postToDelete.title,
        `Đã xóa bài thảo luận`
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>💬 Diễn đàn trao đổi & Chia sẻ chuyên môn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Không gian thân mật để các cô giáo Khối B trao đổi kinh nghiệm, giải đáp thắc mắc và chia sẻ sáng kiến đồ chơi
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-300/40 hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo chủ đề thảo luận</span>
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
            placeholder="Tìm theo chủ đề, nội dung thảo luận, người đăng..."
            className="w-full rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 pl-9 pr-3 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/70 py-2 px-3 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">🗨️ Tất cả chủ đề thảo luận</option>
          <option value="lam_do_dung_do_choi">Làm đồ dùng đồ chơi tự tạo</option>
          <option value="phuong_phap_gd">Phương pháp giáo dục mới</option>
          <option value="thao_go_kho_khan">Tháo gỡ khó khăn trong lớp</option>
          <option value="kinh_nghiem_hay">Chia sẻ kinh nghiệm hay</option>
          <option value="khac">Trao đổi chuyên môn chung</option>
        </select>
      </div>

      {/* Discussions Posts Stream */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 backdrop-blur-md bg-white/60 rounded-3xl border border-white/80 p-6 shadow-xs">
            <MessageSquareHeart className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Chưa có bài thảo luận nào theo bộ lọc.</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const hasLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
            return (
              <div
                key={post.id}
                className="rounded-3xl border border-white/80 backdrop-blur-md bg-white/65 p-6 shadow-sm hover:shadow-lg hover:border-white/95 transition-all space-y-4"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'}
                      alt={post.authorName}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white/80 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{post.authorName}</span>
                        {post.authorRole === 'leader' ? (
                          <span className="rounded-full bg-rose-100/80 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                            Tổ trưởng
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                            Giáo viên
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {post.createdAt.includes('T') ? post.createdAt.split('T')[0] : post.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100/80 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200 backdrop-blur-xs">
                      {categoryLabels[post.category]}
                    </span>

                    {(isLeader || currentUser?.id === post.authorId) && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="rounded-xl p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white/80 transition-colors"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post content */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{post.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-white/70 border border-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Like & Comment Bar */}
                <div className="pt-3 border-t border-white/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${
                        hasLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${hasLiked ? 'fill-rose-600' : ''}`} />
                      <span>{post.likesCount} Thích</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                      }
                      className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-emerald-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments.length} Bình luận</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">Trường Mầm non Vỹ Dạ</span>
                </div>

                {/* Comments Section */}
                {post.comments.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-100/60 bg-slate-50/50 p-3 rounded-xl">
                    {post.comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2.5 text-xs">
                        <img
                          src={c.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                          alt={c.authorName}
                          className="h-6 w-6 rounded-full object-cover mt-0.5"
                        />
                        <div className="flex-1 rounded-xl bg-white p-2.5 border border-slate-200/70">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-[11px]">{c.authorName}</span>
                            <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                          </div>
                          <p className="text-slate-700 mt-1 leading-relaxed text-[11px]">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input Box */}
                <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={activeCommentPostId === post.id ? commentText : ''}
                    onFocus={() => setActiveCommentPostId(post.id)}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Viết bình luận, chia sẻ đóng góp ý kiến..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() && activeCommentPostId !== post.id}
                    className="rounded-xl bg-emerald-600 p-2 text-white hover:bg-emerald-700 disabled:opacity-40 transition-all shadow-xs"
                    title="Gửi bình luận"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create Discussion Post */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tạo chủ đề thảo luận chuyên môn"
        subtitle="Chia sẻ kinh nghiệm, đề xuất giải pháp, hoặc thảo luận làm đồ chơi cho trẻ"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tiêu đề chủ đề: *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Kinh nghiệm làm đồ dùng học toán từ bìa carton và nắp chai tái chế"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Chủ đề thảo luận:</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as DiscussionCategory)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="lam_do_dung_do_choi">Làm đồ dùng đồ chơi tự tạo</option>
              <option value="phuong_phap_gd">Phương pháp giáo dục mới</option>
              <option value="thao_go_kho_khan">Tháo gỡ khó khăn trong lớp</option>
              <option value="kinh_nghiem_hay">Chia sẻ kinh nghiệm hay</option>
              <option value="khac">Trao đổi chuyên môn chung</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Nội dung chia sẻ / Thảo luận: *</label>
            <textarea
              rows={5}
              required
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Chia sẻ chi tiết các bước, nguyên liệu chuẩn bị, kết quả thu được hoặc câu hỏi cần đồng nghiệp giải đáp..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Thẻ phân loại (ngăn cách bởi dấu phẩy):</label>
            <input
              type="text"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="Khối B, Đồ chơi mầm non, KPKH"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
            >
              Đăng chủ đề
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
