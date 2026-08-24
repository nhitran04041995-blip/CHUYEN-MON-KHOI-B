export type UserRole = 'to_truong' | 'giao_vien' | 'leader' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string; // e.g. "Tổ trưởng chuyên môn", "Giáo viên Lớp Lớn 1"
  classAssigned?: string;
  phone?: string;
  duties?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export type TaskStatus = 'completed' | 'in_progress' | 'pending';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskPeriod = 'daily' | 'weekly' | 'monthly' | 'school_year';

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: string;
}

export interface Task {
  id: string;
  code: string; // e.g. "CV-001"
  title: string;
  description: string;
  assignedTo: string; // User ID
  assignedToName: string;
  assignedToAvatar?: string;
  coordinators?: string[]; // Array of User IDs
  coordinatorNames?: string[];
  period: TaskPeriod;
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  progress: number; // 0 to 100
  notes?: string;
  resultEvidence?: string;
  attachments?: TaskAttachment[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  updatedByName?: string;
}

export type PlanType =
  | 'nam_hoc'
  | 'thang'
  | 'tuan'
  | 'chuyen_de'
  | 'thao_giang'
  | 'du_gio'
  | 'hoat_dong_gd'
  | 'khac';

export interface Plan {
  id: string;
  title: string;
  type: PlanType;
  academicYear: string;
  monthOrWeek?: string;
  content: string;
  assignedTo: string;
  assignedToName: string;
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
  startDate: string;
  endDate: string;
  attachments?: TaskAttachment[];
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export type LessonDomain =
  | 'the_chat'
  | 'nhan_thuc'
  | 'ngon_ngu'
  | 'tinh_cam_knxh'
  | 'tham_my'
  | 'ngoai_troi'
  | 'hoat_dong_goc'
  | 'hoat_dong_chieu'
  | 'khac';

export type AgeGroup = '3_4_tuoi' | '4_5_tuoi' | '5_6_tuoi' | 'nha_tre';

export interface LessonPlan {
  id: string;
  title: string;
  topic: string; // Chủ đề: e.g. "Thế giới thực vật", "Bản thân"
  ageGroup: AgeGroup;
  domain: LessonDomain;
  teacherId: string;
  teacherName: string;
  teachingDate: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  thumbnailUrl?: string;
  notes?: string;
  rating?: number; // 1-5 sao
  viewsCount?: number;
  downloadsCount?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type DigitalLessonType = 'canva' | 'powerpoint' | 'pdf' | 'video' | 'interactive';
export type DigitalLessonFormat = DigitalLessonType;

export interface DigitalLesson {
  id: string;
  title: string;
  topic: string;
  ageGroup: AgeGroup;
  domain?: LessonDomain;
  type?: DigitalLessonType;
  format?: DigitalLessonType;
  externalLink?: string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  thumbnailUrl?: string;
  description: string;
  creatorId?: string;
  creatorName?: string;
  authorId?: string;
  authorName?: string;
  academicYear?: string;
  downloadsCount?: number;
  viewsCount?: number;
  likesCount?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory =
  | 'van_ban_chi_dao'
  | 'cong_van'
  | 'chuong_trinh_gdmn'
  | 'tap_huan'
  | 'tai_lieu_tap_huan'
  | 'chuyen_de'
  | 'tham_khao'
  | 'bieu_mau'
  | 'media'
  | 'thong_tu_huong_dan';

export interface DocumentItem {
  id: string;
  code?: string;
  documentCode?: string;
  title: string;
  category: DocumentCategory;
  issuer?: string;
  issuedBy?: string;
  issueDate?: string;
  issuedDate?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  uploaderId?: string;
  uploaderName?: string;
  uploadedBy?: string;
  uploadedByName?: string;
  downloadsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionComment {
  id: string;
  discussionId?: string;
  userId?: string;
  authorId?: string;
  userName?: string;
  authorName?: string;
  userAvatar?: string;
  authorAvatar?: string;
  userRole?: UserRole;
  content: string;
  likesCount?: number;
  createdAt: string;
  attachments?: TaskAttachment[];
}

export type DiscussionCategory =
  | 'phuong_phap_gd'
  | 'lam_do_dung_do_choi'
  | 'do_dung_do_choi'
  | 'thao_go_kho_khan'
  | 'kinh_nghiem_hay'
  | 'cau_hoi'
  | 'y_tuong'
  | 'kinh_nghiem'
  | 'de_xuat'
  | 'ho_tro'
  | 'chia_se'
  | 'khac';

export interface DiscussionPost {
  id: string;
  title: string;
  category: DiscussionCategory;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  isPinned: boolean;
  likes?: string[];
  likedBy?: string[];
  likesCount?: number;
  comments?: DiscussionComment[];
  commentsCount?: number;
  tags?: string[];
  attachments?: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventType =
  | 'hop_chuyen_mon'
  | 'du_gio'
  | 'thao_giang'
  | 'kiem_tra_so_sach'
  | 'nop_giao_an'
  | 'su_kien_chung'
  | 'hop_to'
  | 'chuyen_de'
  | 'hoat_dong_gd'
  | 'han_ke_hoach'
  | 'han_giao_an'
  | 'khac';

export type EventType = CalendarEventType;

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date?: string; // YYYY-MM-DD
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  location?: string;
  leader?: string;
  leaderName?: string;
  participants?: string | string[];
  description?: string;
  color?: string;
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
}

export type AnnouncementType = 'khan' | 'hop' | 'chuyen_mon' | 'ke_hoach' | 'khac';

export interface Announcement {
  id: string;
  title: string;
  type?: AnnouncementType;
  content: string;
  isImportant?: boolean;
  isPinned: boolean;
  isUrgent?: boolean;
  authorId: string;
  authorName: string;
  authorRole?: UserRole;
  authorAvatar?: string;
  readBy?: string[];
  attachments?: TaskAttachment[];
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'status_change'
    | 'progress_update'
    | 'upload'
    | 'comment';
  targetType?: string;
  targetEntity?: string;
  targetTitle: string;
  details?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string; // Target user or 'all'
  title: string;
  message: string;
  type: 'task_assigned' | 'task_due' | 'task_completed' | 'announcement' | 'comment' | 'document';
  linkTab?: string;
  isRead: boolean;
  createdAt: string;
}

export interface WallpaperConfig {
  presetId: string;
  type: 'preset' | 'custom_url' | 'custom_upload' | 'gradient';
  imageUrl?: string;
  overlayOpacity: number; // 0 to 90 (% frosted glass overlay)
  blur: number; // 0, 2, 4, 8, 12 px
  overlayTheme: 'light_frost' | 'warm_sun' | 'cool_breeze' | 'soft_pink' | 'crystal_clear';
}

export interface AppSettings {
  schoolName: string;
  blockName: string;
  appName?: string;
  appSlogan?: string;
  slogan?: string;
  currentAcademicYear?: string;
  academicYear?: string;
  currentSemester: string;
  leadTeacherId?: string;
  leadTeacherName?: string;
  wallpaper?: WallpaperConfig;
}

