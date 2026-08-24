import {
  User,
  Task,
  Plan,
  LessonPlan,
  DigitalLesson,
  DocumentItem,
  DiscussionPost,
  DiscussionComment,
  CalendarEvent,
  Announcement,
  ActivityLog,
  AppNotification,
  AppSettings,
  WallpaperConfig,
} from '../types';
import { DEFAULT_WALLPAPER_CONFIG } from '../data/wallpapers';

const STORAGE_KEYS = {
  USERS: 'vydamn_users_v2',
  TASKS: 'vydamn_tasks_v2',
  PLANS: 'vydamn_plans_v2',
  LESSONS: 'vydamn_lessons_v2',
  DIGITAL_LESSONS: 'vydamn_digital_lessons_v2',
  DOCUMENTS: 'vydamn_documents_v2',
  DISCUSSIONS: 'vydamn_discussions_v2',
  COMMENTS: 'vydamn_comments_v2',
  CALENDAR: 'vydamn_calendar_v2',
  ANNOUNCEMENTS: 'vydamn_announcements_v2',
  ACTIVITY_LOGS: 'vydamn_logs_v2',
  NOTIFICATIONS: 'vydamn_notifications_v2',
  SETTINGS: 'vydamn_settings_v2',
  CURRENT_USER: 'vydamn_current_user_v2',
};

// Initial realistic seed data
export const INITIAL_USERS: User[] = [
  {
    id: 'user-tt-01',
    name: 'Cô Trần Thị Yến Nhi',
    email: 'nhitran04041995@gmail.com',
    role: 'to_truong',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    title: 'Tổ trưởng Chuyên môn Khối B',
    classAssigned: 'Phụ trách chung Khối B (Lớp Nhỡ & Lớp Lớn)',
    phone: '0905.123.456',
    status: 'active',
  },
  {
    id: 'user-tp-02',
    name: 'Cô Lê Thị Mai Chi',
    email: 'maichi.vydia@gmail.com',
    role: 'giao_vien',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=250',
    title: 'Tổ phó Chuyên môn - GV Lớp Nhỡ 1',
    classAssigned: 'Lớp Nhỡ 1 (4 - 5 tuổi)',
    phone: '0914.888.999',
    status: 'active',
  },
  {
    id: 'user-gv-03',
    name: 'Cô Hoàng Thị Thảo',
    email: 'hoangthao.vydia@gmail.com',
    role: 'giao_vien',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    title: 'Giáo viên Lớp Nhỡ 2',
    classAssigned: 'Lớp Nhỡ 2 (4 - 5 tuổi)',
    phone: '0935.234.567',
    status: 'active',
  },
  {
    id: 'user-gv-04',
    name: 'Cô Phan Ngọc Ánh',
    email: 'ngocanh.vydia@gmail.com',
    role: 'giao_vien',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    title: 'Giáo viên Lớp Lớn 1',
    classAssigned: 'Lớp Lớn 1 (5 - 6 tuổi)',
    phone: '0988.456.789',
    status: 'active',
  },
  {
    id: 'user-gv-05',
    name: 'Cô Nguyễn Thị Bích Loan',
    email: 'bichloan.vydia@gmail.com',
    role: 'giao_vien',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    title: 'Giáo viên Lớp Lớn 2',
    classAssigned: 'Lớp Lớn 2 (5 - 6 tuổi)',
    phone: '0977.112.233',
    status: 'active',
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  schoolName: 'TRƯỜNG MẦM NON VỸ DẠ',
  blockName: 'KHỐI B (MẪU GIÁO NHỠ & LỚN)',
  slogan: 'Kết nối chuyên môn - Chia sẻ trách nhiệm - Đồng hành hiệu quả',
  academicYear: '2025 - 2026',
  currentSemester: 'Học kỳ II',
  leadTeacherId: 'user-tt-01',
  leadTeacherName: 'Cô Trần Thị Yến Nhi',
  wallpaper: DEFAULT_WALLPAPER_CONFIG,
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-01',
    code: 'CV-001',
    title: 'Duyệt kế hoạch giáo dục và giáo án tuần 25',
    description: 'Kiểm tra mục tiêu, chuẩn bị đồ dùng và tiến trình các hoạt động học theo chủ đề Thế giới Động vật.',
    assignedTo: 'user-tt-01',
    assignedToName: 'Cô Trần Thị Yến Nhi',
    assignedToAvatar: INITIAL_USERS[0].avatar,
    coordinators: ['user-tp-02'],
    coordinatorNames: ['Cô Lê Thị Mai Chi'],
    period: 'weekly',
    startDate: '2026-08-20',
    dueDate: '2026-08-25',
    priority: 'high',
    status: 'completed',
    progress: 100,
    notes: 'Đã ký duyệt đủ 4 bộ giáo án của 4 lớp, lưu ý bổ sung trò chơi vận động ngoài trời cho Lớp Nhỡ 2.',
    resultEvidence: 'Đã lưu file ký số trên hệ thống và kho giáo án.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-20T08:00:00Z',
    updatedAt: '2026-08-24T10:30:00Z',
    updatedByName: 'Cô Trần Thị Yến Nhi',
  },
  {
    id: 'task-02',
    code: 'CV-002',
    title: 'Chuẩn bị tiết thao giảng cấp Trường - Khám phá khoa học',
    description: 'Xây dựng bài giảng điện tử tương tác và chuẩn bị giáo cụ trải nghiệm "Vòng đời của chú bướm nhỏ" cho trẻ 5-6 tuổi.',
    assignedTo: 'user-gv-04',
    assignedToName: 'Cô Phan Ngọc Ánh',
    assignedToAvatar: INITIAL_USERS[3].avatar,
    coordinators: ['user-tt-01', 'user-gv-05'],
    coordinatorNames: ['Cô Trần Thị Yến Nhi', 'Cô Nguyễn Thị Bích Loan'],
    period: 'monthly',
    startDate: '2026-08-22',
    dueDate: '2026-08-28',
    priority: 'high',
    status: 'in_progress',
    progress: 75,
    notes: 'Đã hoàn thiện slide Canva và làm xong 20 bộ rối tay hình kén bướm cho trẻ. Đang chạy thử nghiệm hoạt động nhóm.',
    attachments: [
      {
        id: 'att-1',
        name: 'Giao_an_Thao_giang_Vong_doi_buom.docx',
        url: '#',
        type: 'docx',
        size: '1.4 MB',
      },
    ],
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-22T09:00:00Z',
    updatedAt: '2026-08-24T11:15:00Z',
    updatedByName: 'Cô Phan Ngọc Ánh',
  },
  {
    id: 'task-03',
    code: 'CV-003',
    title: 'Tổ chức sinh hoạt chuyên môn: Đổi mới phương pháp STEAM trong tạo hình',
    description: 'Tập huấn nội bộ khối cách ứng dụng nguyên vật liệu tái chế tự nhiên (lá cây, sỏi, vỏ sò Vỹ Dạ) vào hoạt động tạo hình.',
    assignedTo: 'user-tp-02',
    assignedToName: 'Cô Lê Thị Mai Chi',
    assignedToAvatar: INITIAL_USERS[1].avatar,
    coordinators: ['user-gv-03', 'user-gv-04', 'user-gv-05'],
    coordinatorNames: ['Cô Hoàng Thị Thảo', 'Cô Phan Ngọc Ánh', 'Cô Nguyễn Thị Bích Loan'],
    period: 'monthly',
    startDate: '2026-08-21',
    dueDate: '2026-08-29',
    priority: 'medium',
    status: 'in_progress',
    progress: 50,
    notes: 'Đã thu thập nguyên liệu và soạn xong khung nội dung thảo luận chia sẻ.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-21T14:00:00Z',
    updatedAt: '2026-08-23T16:00:00Z',
    updatedByName: 'Cô Lê Thị Mai Chi',
  },
  {
    id: 'task-04',
    code: 'CV-004',
    title: 'Cập nhật sổ theo dõi sức khỏe và biểu đồ tăng trưởng trẻ quý III',
    description: 'Tổng hợp số đo chiều cao, cân nặng và phân loại trẻ suy dinh dưỡng/thừa cân của 2 lớp Nhỡ và 2 lớp Lớn.',
    assignedTo: 'user-gv-03',
    assignedToName: 'Cô Hoàng Thị Thảo',
    assignedToAvatar: INITIAL_USERS[2].avatar,
    coordinators: ['user-tp-02'],
    coordinatorNames: ['Cô Lê Thị Mai Chi'],
    period: 'monthly',
    startDate: '2026-08-23',
    dueDate: '2026-08-30',
    priority: 'medium',
    status: 'in_progress',
    progress: 40,
    notes: 'Đã đo xong Lớp Nhỡ 1 và Nhỡ 2, ngày mai sẽ tổng hợp số liệu Lớp Lớn 1 & 2.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-23T07:30:00Z',
    updatedAt: '2026-08-24T09:00:00Z',
    updatedByName: 'Cô Hoàng Thị Thảo',
  },
  {
    id: 'task-05',
    code: 'CV-005',
    title: 'Trang trí môi trường chữ viết và góc phát triển ngôn ngữ',
    description: 'Bổ sung thẻ từ, góc đọc sách tranh dân gian và bảng tương tác cho trẻ chuẩn bị tâm thế vào lớp 1.',
    assignedTo: 'user-gv-05',
    assignedToName: 'Cô Nguyễn Thị Bích Loan',
    assignedToAvatar: INITIAL_USERS[4].avatar,
    coordinators: ['user-gv-04'],
    coordinatorNames: ['Cô Phan Ngọc Ánh'],
    period: 'weekly',
    startDate: '2026-08-24',
    dueDate: '2026-08-27',
    priority: 'high',
    status: 'pending',
    progress: 10,
    notes: 'Đang in ấn học liệu và tranh thơ tranh chữ to.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-24T08:00:00Z',
    updatedAt: '2026-08-24T08:00:00Z',
    updatedByName: 'Cô Trần Thị Yến Nhi',
  },
  {
    id: 'task-06',
    code: 'CV-006',
    title: 'Kiểm tra vệ sinh an toàn phòng học và đồ chơi ngoài trời',
    description: 'Khử khuẩn đồ chơi bằng dung dịch Cloramin B, kiểm tra độ an toàn của cầu trượt, xích đu sân vườn mầm non.',
    assignedTo: 'user-tp-02',
    assignedToName: 'Cô Lê Thị Mai Chi',
    assignedToAvatar: INITIAL_USERS[1].avatar,
    coordinators: ['user-gv-03', 'user-gv-04', 'user-gv-05'],
    coordinatorNames: ['Cô Hoàng Thị Thảo', 'Cô Phan Ngọc Ánh', 'Cô Nguyễn Thị Bích Loan'],
    period: 'daily',
    startDate: '2026-08-24',
    dueDate: '2026-08-24',
    priority: 'high',
    status: 'completed',
    progress: 100,
    notes: 'Đã vệ sinh sạch sẽ 100% đồ chơi các góc và kiểm tra an toàn sân bóng mini.',
    resultEvidence: 'Hình ảnh đã chụp và biên bản lưu sổ nhật ký vệ sinh.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-24T06:30:00Z',
    updatedAt: '2026-08-24T11:45:00Z',
    updatedByName: 'Cô Lê Thị Mai Chi',
  },
  {
    id: 'task-07',
    code: 'CV-007',
    title: 'Xây dựng ngân hàng trò chơi dân gian xứ Huế cho trẻ mầm non',
    description: 'Sưu tầm, chuyển thể luật chơi phù hợp lứa tuổi: Rồng rắn lên mây, Chi chi chành chành, Đua thuyền trên cạn, Nu na nu nống.',
    assignedTo: 'user-gv-03',
    assignedToName: 'Cô Hoàng Thị Thảo',
    assignedToAvatar: INITIAL_USERS[2].avatar,
    period: 'school_year',
    startDate: '2026-08-15',
    dueDate: '2026-09-10',
    priority: 'low',
    status: 'in_progress',
    progress: 60,
    notes: 'Đã hoàn thiện tài liệu mô tả 12 trò chơi kèm bài đồng dao có ghi âm mẫu.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-22T15:00:00Z',
    updatedByName: 'Cô Hoàng Thị Thảo',
  },
  {
    id: 'task-08',
    code: 'CV-008',
    title: 'Nộp báo cáo đánh giá trẻ cuối chủ đề Giao thông',
    description: 'Tổng hợp phiếu đánh giá theo 5 lĩnh vực phát triển đối với từng cá nhân trẻ.',
    assignedTo: 'user-gv-05',
    assignedToName: 'Cô Nguyễn Thị Bích Loan',
    assignedToAvatar: INITIAL_USERS[4].avatar,
    period: 'monthly',
    startDate: '2026-08-18',
    dueDate: '2026-08-23',
    priority: 'high',
    status: 'completed',
    progress: 100,
    notes: 'Đã nộp đủ báo cáo của 32 cháu Lớp Lớn 2, đạt 100% chỉ số đánh giá.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-18T08:00:00Z',
    updatedAt: '2026-08-23T17:00:00Z',
    updatedByName: 'Cô Nguyễn Thị Bích Loan',
  },
  {
    id: 'task-09',
    code: 'CV-009',
    title: 'Soạn video bài giảng âm nhạc "Em đi qua ngã tư đường phố"',
    description: 'Thu âm, dựng video hoạt hình hướng dẫn trẻ múa phụ họa và gõ đệm tiết tấu.',
    assignedTo: 'user-gv-04',
    assignedToName: 'Cô Phan Ngọc Ánh',
    assignedToAvatar: INITIAL_USERS[3].avatar,
    period: 'weekly',
    startDate: '2026-08-25',
    dueDate: '2026-08-31',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    notes: 'Chưa khởi động, dự kiến quay video tại phòng âm nhạc vào chiều thứ 5.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-24T10:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z',
    updatedByName: 'Cô Trần Thị Yến Nhi',
  },
  {
    id: 'task-10',
    code: 'CV-010',
    title: 'Kiểm kê và bổ sung học cụ góc đóng vai Lớp Nhỡ 1',
    description: 'Bổ sung trang phục bác sĩ, đồ dùng gia đình và siêu thị mini cho trẻ trải nghiệm.',
    assignedTo: 'user-tp-02',
    assignedToName: 'Cô Lê Thị Mai Chi',
    assignedToAvatar: INITIAL_USERS[1].avatar,
    period: 'daily',
    startDate: '2026-08-24',
    dueDate: '2026-08-26',
    priority: 'low',
    status: 'pending',
    progress: 15,
    notes: 'Đang lên danh sách đồ dùng cần xin cấp phát từ kho nhà trường.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-24T11:00:00Z',
    updatedAt: '2026-08-24T11:30:00Z',
    updatedByName: 'Cô Lê Thị Mai Chi',
  },
];

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-01',
    title: 'Kế hoạch thực hiện nhiệm vụ chuyên môn Khối B Năm học 2025 - 2026',
    type: 'nam_hoc',
    academicYear: '2025 - 2026',
    content: 'Định hướng trọng tâm: 100% trẻ được đảm bảo an toàn tuyệt đối; nâng cao chất lượng nuôi dưỡng chăm sóc giáo dục; đẩy mạnh ứng dụng công nghệ số và phương pháp giáo dục tiên tiến STEAM; xây dựng trường mầm non lấy trẻ làm trung tâm.',
    assignedTo: 'user-tt-01',
    assignedToName: 'Cô Trần Thị Yến Nhi',
    status: 'in_progress',
    startDate: '2025-09-01',
    endDate: '2026-05-31',
    notes: 'Đã thông qua Hội đồng chuyên môn Trường Mầm Non Vỹ Dạ phê duyệt.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2025-08-28T09:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'plan-02',
    title: 'Kế hoạch công tác chuyên môn Tháng 8/2026: Ổn định nền nếp & Chuẩn bị năm học mới',
    type: 'thang',
    academicYear: '2025 - 2026',
    monthOrWeek: 'Tháng 8/2026',
    content: '1. Rà soát cơ sở vật chất, đồ dùng đồ chơi 4 phòng học khối B.\n2. Tổ chức bồi dưỡng chuyên môn hè, sinh hoạt chuyên đề theo tổ.\n3. Xây dựng môi trường lớp học hạnh phúc, thân thiện.\n4. Họp phụ huynh đầu năm và thống nhất quy chế phối hợp.',
    assignedTo: 'user-tt-01',
    assignedToName: 'Cô Trần Thị Yến Nhi',
    status: 'in_progress',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    notes: 'Các lớp đang tích cực triển khai các hoạt động đón trẻ.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-22T14:00:00Z',
  },
  {
    id: 'plan-03',
    title: 'Kế hoạch thao giảng & dự giờ chuyên đề Đổi mới phương pháp dạy học',
    type: 'thao_giang',
    academicYear: '2025 - 2026',
    monthOrWeek: 'Tuần 25 - 26',
    content: 'Tổ chức 4 tiết thao giảng mẫu cho 4 giáo viên trong khối:\n- Tiết 1: KPKH Vòng đời của bướm (Cô Ánh - Lớp Lớn 1)\n- Tiết 2: Âm nhạc Dạy hát Em đi qua ngã tư (Cô Chi - Lớp Nhỡ 1)\n- Tiết 3: Tạo hình Làm bưu thiếp tặng cô (Cô Thảo - Lớp Nhỡ 2)\n- Tiết 4: Làm quen chữ cái v, r (Cô Loan - Lớp Lớn 2)',
    assignedTo: 'user-tp-02',
    assignedToName: 'Cô Lê Thị Mai Chi',
    status: 'in_progress',
    startDate: '2026-08-25',
    endDate: '2026-09-05',
    notes: 'Kính mời Ban giám hiệu và toàn thể giáo viên khối B cùng tham dự rút kinh nghiệm.',
    createdBy: 'user-tt-01',
    createdByName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-19T08:30:00Z',
    updatedAt: '2026-08-24T09:15:00Z',
  },
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-01',
    title: 'Khám phá khoa học: Vòng đời và sự phát triển kỳ diệu của loài bướm',
    topic: 'Thế giới Động vật & Thiên nhiên',
    ageGroup: '5_6_tuoi',
    domain: 'nhan_thuc',
    teacherId: 'user-gv-04',
    teacherName: 'Cô Phan Ngọc Ánh',
    teachingDate: '2026-08-28',
    content: 'Mục đích: Trẻ nhận biết và gọi tên 4 giai đoạn sinh trưởng của bướm (Trứng -> Sâu bướm -> Nhộng/Kén -> Bướm trưởng thành). Kỹ năng quan sát, so sánh, làm việc nhóm và tình cảm yêu quý thế giới tự nhiên.',
    fileName: 'Giao_an_KPKH_Vong_doi_buom_5_6T.docx',
    fileSize: '840 KB',
    rating: 5,
    viewsCount: 34,
    downloadsCount: 18,
    createdBy: 'user-gv-04',
    createdAt: '2026-08-21T09:00:00Z',
    updatedAt: '2026-08-23T15:00:00Z',
  },
  {
    id: 'lp-02',
    title: 'Phát triển thể chất: Bật xa 45-50cm - Ném trúng đích nằm ngang',
    topic: 'Bản thân & Vận động',
    ageGroup: '4_5_tuoi',
    domain: 'the_chat',
    teacherId: 'user-tp-02',
    teacherName: 'Cô Lê Thị Mai Chi',
    teachingDate: '2026-08-26',
    content: 'Mục đích: Rèn luyện cơ chân, sự khéo léo, khả năng định hướng không gian và tinh thần đồng đội qua trò chơi chuyển bóng tiếp sức.',
    fileName: 'Giao_an_The_chat_Bat_xa_4_5T.docx',
    fileSize: '620 KB',
    rating: 5,
    viewsCount: 28,
    downloadsCount: 14,
    createdBy: 'user-tp-02',
    createdAt: '2026-08-20T10:30:00Z',
    updatedAt: '2026-08-22T08:00:00Z',
  },
  {
    id: 'lp-03',
    title: 'Làm quen văn học: Truyện "Giọt nước tí xíu" (Ứng dụng sa bàn nước tương tác)',
    topic: 'Nước và các hiện tượng tự nhiên',
    ageGroup: '4_5_tuoi',
    domain: 'ngon_ngu',
    teacherId: 'user-gv-03',
    teacherName: 'Cô Hoàng Thị Thảo',
    teachingDate: '2026-08-27',
    content: 'Mục đích: Giúp trẻ hiểu nội dung câu chuyện, hiện tượng bốc hơi và ngưng tụ tạo thành mưa. Phát triển ngôn ngữ mạch lạc, nói câu trọn nghĩa.',
    fileName: 'Giao_an_Truyen_Giot_nuoc_ti_xiu.docx',
    fileSize: '1.1 MB',
    rating: 5,
    viewsCount: 42,
    downloadsCount: 22,
    createdBy: 'user-gv-03',
    createdAt: '2026-08-19T14:20:00Z',
    updatedAt: '2026-08-23T11:00:00Z',
  },
  {
    id: 'lp-04',
    title: 'Phát triển thẩm mỹ: Tạo hình "Vườn hoa sắc màu bên dòng sông Hương"',
    topic: 'Quê hương đất nước & Cố đô Huế',
    ageGroup: '5_6_tuoi',
    domain: 'tham_my',
    teacherId: 'user-gv-05',
    teacherName: 'Cô Nguyễn Thị Bích Loan',
    teachingDate: '2026-08-29',
    content: 'Mục đích: Trẻ sử dụng kỹ năng xé dán, in vân ngón tay, chấm màu nước tạo nên bức tranh phong cảnh Vỹ Dạ - Huế rực rỡ.',
    fileName: 'Giao_an_Tao_hinh_Vuon_hoa_Vy_Da.docx',
    fileSize: '950 KB',
    rating: 5,
    viewsCount: 39,
    downloadsCount: 20,
    createdBy: 'user-gv-05',
    createdAt: '2026-08-22T08:15:00Z',
    updatedAt: '2026-08-24T09:40:00Z',
  },
  {
    id: 'lp-05',
    title: 'Giáo dục Kỹ năng sống: Dạy trẻ kỹ năng tự bảo vệ bản thân và Quy tắc 5 ngón tay',
    topic: 'Kỹ năng xã hội & Bản thân',
    ageGroup: '5_6_tuoi',
    domain: 'tinh_cam_knxh',
    teacherId: 'user-tt-01',
    teacherName: 'Cô Trần Thị Yến Nhi',
    teachingDate: '2026-08-25',
    content: 'Mục đích: Dạy trẻ phân biệt các vùng riêng tư trên cơ thể, nhận biết người lạ và cách ứng phó khi gặp nguy hiểm hoặc cần giúp đỡ.',
    fileName: 'Giao_an_KNXH_Quy_tac_5_ngon_tay.docx',
    fileSize: '1.2 MB',
    rating: 5,
    viewsCount: 56,
    downloadsCount: 31,
    createdBy: 'user-tt-01',
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-24T08:00:00Z',
  },
];

export const INITIAL_DIGITAL_LESSONS: DigitalLesson[] = [
  {
    id: 'dl-01',
    title: 'Bài giảng Canva Tương tác: Khám phá Thế giới Động vật sống dưới nước',
    topic: 'Thế giới Động vật',
    ageGroup: '5_6_tuoi',
    domain: 'nhan_thuc',
    type: 'canva',
    externalLink: 'https://www.canva.com/design/DAFexampleLessonVyDa',
    description: 'Bộ slide Canva tương tác với âm thanh sinh động, câu đố giải cứu sinh vật biển, trò chơi chọn thức ăn cho cá heo.',
    creatorId: 'user-gv-04',
    creatorName: 'Cô Phan Ngọc Ánh',
    academicYear: '2025 - 2026',
    downloadsCount: 45,
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-22T14:30:00Z',
  },
  {
    id: 'dl-02',
    title: 'PowerPoint Trò chơi tương tác: Bé trổ tài nhận biết Chữ cái & Con số',
    topic: 'Làm quen chữ viết & Toán',
    ageGroup: '5_6_tuoi',
    domain: 'ngon_ngu',
    type: 'powerpoint',
    fileName: 'Tro_choi_Chu_cai_V_R_PowerPoint.pptx',
    fileUrl: '#',
    description: 'Trò chơi Vòng quay may mắn và Mở ô chữ bí mật được thiết kế bằng hiệu ứng trigger PowerPoint chuyên nghiệp.',
    creatorId: 'user-gv-05',
    creatorName: 'Cô Nguyễn Thị Bích Loan',
    academicYear: '2025 - 2026',
    downloadsCount: 38,
    createdAt: '2026-08-20T14:00:00Z',
    updatedAt: '2026-08-23T16:00:00Z',
  },
  {
    id: 'dl-03',
    title: 'Video hướng dẫn Vận động múa: "Mầm Non Vỹ Dạ - Nơi ươm mầm ước mơ"',
    topic: 'Âm nhạc & Nghệ thuật',
    ageGroup: '4_5_tuoi',
    domain: 'tham_my',
    type: 'video',
    fileName: 'Video_Mua_Vy_Da_Uom_Mam.mp4',
    externalLink: 'https://youtu.be/exampleVyDaVideo',
    description: 'Video quay chất lượng Full HD hướng dẫn từng động tác tay, nhún chân nhịp nhàng cho trẻ tập luyện biểu diễn văn nghệ.',
    creatorId: 'user-tp-02',
    creatorName: 'Cô Lê Thị Mai Chi',
    academicYear: '2025 - 2026',
    downloadsCount: 52,
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-08-21T10:20:00Z',
  },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    code: '51/2020/TT-BGDĐT',
    title: 'Thông tư số 51/2020/TT-BGDĐT: Sửa đổi, bổ sung Chương trình Giáo dục mầm non',
    category: 'chuong_trinh_gdmn',
    issuer: 'Bộ Giáo dục và Đào tạo',
    issueDate: '2020-12-31',
    description: 'Văn bản cốt lõi quy định chương trình GDMN cập nhật, tích hợp nội dung số và đổi mới đánh giá trẻ.',
    fileName: 'Thong_tu_51_2020_TT_BGDDT.pdf',
    fileSize: '2.4 MB',
    uploaderId: 'user-tt-01',
    uploaderName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-10T08:00:00Z',
    updatedAt: '2026-08-10T08:00:00Z',
  },
  {
    id: 'doc-02',
    code: '112/SGDĐT-GDMN',
    title: 'Công văn hướng dẫn thực hiện nhiệm vụ năm học cấp học Mầm non',
    category: 'van_ban_chi_dao',
    issuer: 'Sở GD&ĐT Thừa Thiên Huế',
    issueDate: '2025-09-05',
    description: 'Chỉ đạo trọng tâm về an toàn trường học, chất lượng nuôi dưỡng và chuyên môn hè mầm non.',
    fileName: 'Cong_van_112_Huong_dan_nhiem_vu_GDMN.pdf',
    fileSize: '1.8 MB',
    uploaderId: 'user-tt-01',
    uploaderName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-12T09:30:00Z',
    updatedAt: '2026-08-12T09:30:00Z',
  },
  {
    id: 'doc-03',
    code: 'BM-01/MNVD',
    title: 'Phiếu dự giờ & Tiêu chí đánh giá tiết dạy sinh hoạt chuyên môn Khối B',
    category: 'bieu_mau',
    issuer: 'Tổ Chuyên Môn Khối B - MN Vỹ Dạ',
    issueDate: '2026-08-15',
    description: 'Mẫu chuẩn gồm 4 tiêu chuẩn: Kế hoạch bài dạy, Hoạt động của giáo viên, Hoạt động của trẻ và Hiệu quả giáo dục.',
    fileName: 'Phieu_du_gio_chuyen_mon_Khoi_B.docx',
    fileSize: '450 KB',
    uploaderId: 'user-tt-01',
    uploaderName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-15T11:00:00Z',
    updatedAt: '2026-08-15T11:00:00Z',
  },
  {
    id: 'doc-04',
    code: 'TL-STEAM-01',
    title: 'Tài liệu tập huấn: Ứng dụng phương pháp STEAM và kỹ năng số trong GDMN',
    category: 'tap_huan',
    issuer: 'Phòng GD&ĐT TP Huế',
    issueDate: '2026-07-20',
    description: 'Cẩm nang hướng dẫn thiết kế góc STEAM thực tế với chi phí thấp từ vật liệu bản địa.',
    fileName: 'Tai_lieu_Tap_huan_STEAM_MN.pdf',
    fileSize: '4.8 MB',
    uploaderId: 'user-tp-02',
    uploaderName: 'Cô Lê Thị Mai Chi',
    createdAt: '2026-08-16T14:00:00Z',
    updatedAt: '2026-08-16T14:00:00Z',
  },
  {
    id: 'doc-05',
    code: 'BM-02/MNVD',
    title: 'Sổ theo dõi và Đánh giá sự phát triển của trẻ theo các chỉ số GDMN',
    category: 'bieu_mau',
    issuer: 'Trường Mầm Non Vỹ Dạ',
    issueDate: '2026-08-18',
    description: 'Bảng excel tự động tính toán tỷ lệ đạt chuẩn theo 5 lĩnh vực phát triển của trẻ 4-5 tuổi và 5-6 tuổi.',
    fileName: 'Bang_theo_doi_chi_so_danh_gia_tre.xlsx',
    fileSize: '780 KB',
    uploaderId: 'user-tt-01',
    uploaderName: 'Cô Trần Thị Yến Nhi',
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-18T10:00:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-01',
    title: '📌 THÔNG BÁO QUAN TRỌNG: Lịch sinh hoạt chuyên môn khối B và Thao giảng tuần 25',
    content: 'Kính gửi các cô giáo Khối B:\nChiều Thứ Năm (14h00 ngày 28/08/2026), Tổ chuyên môn Khối B sẽ tiến hành dự giờ tiết thao giảng của Cô Phan Ngọc Ánh tại Lớp Lớn 1 và họp rút kinh nghiệm chuyên môn tại phòng Hội đồng.\nĐề nghị tất cả các cô chuẩn bị sổ dự giờ và trang phục đúng quy định.',
    isImportant: true,
    isPinned: true,
    authorId: 'user-tt-01',
    authorName: 'Cô Trần Thị Yến Nhi (Tổ trưởng)',
    createdAt: '2026-08-24T07:30:00Z',
  },
  {
    id: 'anc-02',
    title: '🔔 Nhắc nhở hạn nộp Kế hoạch giáo dục tháng 9 và Giáo án tuần 1 năm học mới',
    content: 'Đề nghị giáo viên phụ trách 4 lớp hoàn thiện kế hoạch chủ đề "Trường mầm non thân yêu" và gửi file lên hệ thống trước 17h00 ngày Thứ Sáu (29/08/2026) để Tổ trưởng duyệt.',
    isImportant: true,
    isPinned: true,
    authorId: 'user-tt-01',
    authorName: 'Cô Trần Thị Yến Nhi (Tổ trưởng)',
    createdAt: '2026-08-23T15:00:00Z',
  },
  {
    id: 'anc-03',
    title: '🌿 Phát động phong trào "Xây dựng góc thiên nhiên xanh - Lớp học hạnh phúc"',
    content: 'Khối B phát động tuần lễ chăm sóc vườn rau, cây xanh mini và tạo góc thư giãn cho trẻ tại hành lang các lớp. Khen thưởng lớp có góc thiên nhiên sáng tạo và sinh động nhất vào dịp sơ kết tháng!',
    isImportant: false,
    isPinned: false,
    authorId: 'user-tp-02',
    authorName: 'Cô Lê Thị Mai Chi (Tổ phó)',
    createdAt: '2026-08-22T09:00:00Z',
  },
];

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'disc-01',
    title: 'Ý tưởng sáng tạo: Cách làm rối tay từ tất len cũ và ống hút giúp trẻ hứng thú kể chuyện',
    category: 'y_tuong',
    content: 'Chào các cô, đợt này lớp Nhỡ 1 mình vừa làm thử bộ rối ngón tay từ tất cũ và mắt nhựa cho tiết kể chuyện "Chú thỏ Buratino". Các bé cực kỳ thích thú và tranh nhau lên đóng vai. Mình xin chia sẻ các bước đơn giản kèm mẫu đính kèm nhé!',
    authorId: 'user-tp-02',
    authorName: 'Cô Lê Thị Mai Chi',
    authorAvatar: INITIAL_USERS[1].avatar,
    authorRole: 'giao_vien',
    isPinned: true,
    likes: ['user-tt-01', 'user-gv-03', 'user-gv-04', 'user-gv-05'],
    commentsCount: 3,
    createdAt: '2026-08-23T10:00:00Z',
    updatedAt: '2026-08-24T08:30:00Z',
  },
  {
    id: 'disc-02',
    title: 'Kinh nghiệm: Giải pháp giúp trẻ 4-5 tuổi nhút nhát nhanh hòa nhập vào hoạt động góc',
    category: 'kinh_nghiem',
    content: 'Các cô cho mình xin thêm kinh nghiệm với ạ: Đầu năm có 3 cháu lớp Nhỡ 2 còn khóc và ngại tham gia chơi cùng bạn ở góc xây dựng. Mình đã thử xếp cặp bạn thân và cho trẻ làm phụ tá nhóm trưởng, kết quả cải thiện rất tốt sau 3 ngày!',
    authorId: 'user-gv-03',
    authorName: 'Cô Hoàng Thị Thảo',
    authorAvatar: INITIAL_USERS[2].avatar,
    authorRole: 'giao_vien',
    isPinned: false,
    likes: ['user-tt-01', 'user-tp-02', 'user-gv-04'],
    commentsCount: 2,
    createdAt: '2026-08-22T14:15:00Z',
    updatedAt: '2026-08-23T17:00:00Z',
  },
  {
    id: 'disc-03',
    title: 'Câu hỏi chuyên môn: Sử dụng phần mềm nào để cắt ghép nhạc và video múa cho trẻ mầm non dễ nhất?',
    category: 'cau_hoi',
    content: 'Em đang muốn cắt ghép bài múa "Cô và Mẹ" thành bản 2 phút cho tiết mục Lễ khai giảng. Nhờ các cô chỉ giúp ứng dụng nào trên điện thoại hoặc máy tính thao tác nhanh và không bị dính logo mờ với ạ?',
    authorId: 'user-gv-05',
    authorName: 'Cô Nguyễn Thị Bích Loan',
    authorAvatar: INITIAL_USERS[4].avatar,
    authorRole: 'giao_vien',
    isPinned: false,
    likes: ['user-gv-04', 'user-tp-02'],
    commentsCount: 2,
    createdAt: '2026-08-21T16:30:00Z',
    updatedAt: '2026-08-22T09:00:00Z',
  },
  {
    id: 'disc-04',
    title: 'Chia sẻ: Bộ học liệu hình ảnh các nghề nghiệp truyền thống xứ Huế cho trẻ 5-6 tuổi',
    category: 'chia_se',
    content: 'Mình vừa sưu tầm và scan chất lượng cao hình ảnh Làng gốm Phước Tích, Nón bài thơ Tây Hồ, Hoa giấy Thanh Tiên. Bộ tranh rất nét để trình chiếu máy chiếu cho trẻ xem trong chủ đề Quê hương. Các cô tải về dùng chung nhé!',
    authorId: 'user-gv-04',
    authorName: 'Cô Phan Ngọc Ánh',
    authorAvatar: INITIAL_USERS[3].avatar,
    authorRole: 'giao_vien',
    isPinned: false,
    likes: ['user-tt-01', 'user-tp-02', 'user-gv-03', 'user-gv-05'],
    commentsCount: 1,
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-08-20T14:00:00Z',
  },
  {
    id: 'disc-05',
    title: 'Đề xuất: Thống nhất khung giờ cho trẻ tập thể dục sáng ngoài trời khi thời tiết chuyển mùa',
    category: 'de_xuat',
    content: 'Hiện nay buổi sáng thời tiết Huế bắt đầu có sương sớm se lạnh, em đề xuất Khối B lùi giờ tập thể dục sáng từ 7h15 sang 7h30 để đảm bảo giữ ấm sức khỏe đường hô hấp cho các con ạ.',
    authorId: 'user-tt-01',
    authorName: 'Cô Trần Thị Yến Nhi',
    authorAvatar: INITIAL_USERS[0].avatar,
    authorRole: 'to_truong',
    isPinned: false,
    likes: ['user-tp-02', 'user-gv-03', 'user-gv-04', 'user-gv-05'],
    commentsCount: 4,
    createdAt: '2026-08-19T08:00:00Z',
    updatedAt: '2026-08-21T10:00:00Z',
  },
];

export const INITIAL_COMMENTS: DiscussionComment[] = [
  {
    id: 'comm-01',
    discussionId: 'disc-01',
    userId: 'user-tt-01',
    userName: 'Cô Trần Thị Yến Nhi',
    userAvatar: INITIAL_USERS[0].avatar,
    userRole: 'to_truong',
    content: 'Ý tưởng rất tuyệt vời và tiết kiệm! Đề nghị Cô Chi nhân rộng mẫu này trong buổi sinh hoạt chuyên môn thứ Năm tới để cả tổ cùng làm nhé.',
    createdAt: '2026-08-23T11:30:00Z',
  },
  {
    id: 'comm-02',
    discussionId: 'disc-01',
    userId: 'user-gv-04',
    userName: 'Cô Phan Ngọc Ánh',
    userAvatar: INITIAL_USERS[3].avatar,
    userRole: 'giao_vien',
    content: 'Đẹp quá cô Chi ơi, cho em xin mượn mẫu làm cho các bé Lớp Lớn 1 đóng kịch câu chuyện Củ Cải Trắng với nha!',
    createdAt: '2026-08-23T14:00:00Z',
  },
  {
    id: 'comm-03',
    discussionId: 'disc-01',
    userId: 'user-gv-03',
    userName: 'Cô Hoàng Thị Thảo',
    userAvatar: INITIAL_USERS[2].avatar,
    userRole: 'giao_vien',
    content: 'Em cũng có nhiều vải vụn và tất nỉ, chiều mai mình cùng làm chung sau giờ trả trẻ nhé các cô.',
    createdAt: '2026-08-24T08:30:00Z',
  },
  {
    id: 'comm-04',
    discussionId: 'disc-03',
    userId: 'user-gv-04',
    userName: 'Cô Phan Ngọc Ánh',
    userAvatar: INITIAL_USERS[3].avatar,
    userRole: 'giao_vien',
    content: 'Cô Loan dùng ứng dụng CapCut trên điện thoại nhé, có tính năng tách nhạc và ghép rất mượt mà hoàn toàn miễn phí.',
    createdAt: '2026-08-21T17:15:00Z',
  },
  {
    id: 'comm-05',
    discussionId: 'disc-03',
    userId: 'user-tp-02',
    userName: 'Cô Lê Thị Mai Chi',
    userAvatar: INITIAL_USERS[1].avatar,
    userRole: 'giao_vien',
    content: 'Hoặc dùng trang web AudioTrimmer.com trực tiếp trên máy tính không cần cài đặt gì nha cô Loan.',
    createdAt: '2026-08-22T09:00:00Z',
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-01',
    title: 'Họp sinh hoạt chuyên môn Khối B định kỳ',
    type: 'hop_to',
    startDate: '2026-08-28',
    time: '14:00 - 16:30',
    location: 'Văn phòng Hội đồng Khối B',
    leader: 'user-tt-01',
    leaderName: 'Cô Trần Thị Yến Nhi',
    participants: ['Cô Mai Chi', 'Cô Hoàng Thảo', 'Cô Ngọc Ánh', 'Cô Bích Loan'],
    description: 'Đánh giá công tác chuyên môn tháng 8, triển khai kế hoạch giáo dục tháng 9 và phân công phụ trách trang trí môi trường lớp.',
    color: '#2563EB',
    createdAt: '2026-08-20T08:00:00Z',
  },
  {
    id: 'ev-02',
    title: 'Dự giờ & Thao giảng mẫu: KPKH Vòng đời của bướm',
    type: 'thao_giang',
    startDate: '2026-08-28',
    time: '08:30 - 09:30',
    location: 'Phòng học Lớp Lớn 1',
    leader: 'user-gv-04',
    leaderName: 'Cô Phan Ngọc Ánh',
    participants: ['Ban Giám Hiệu', 'Toàn thể giáo viên Khối B'],
    description: 'Thao giảng chuyên đề ứng dụng phương pháp giáo dục tiên tiến STEAM trong khám phá khoa học.',
    color: '#059669',
    createdAt: '2026-08-22T09:00:00Z',
  },
  {
    id: 'ev-03',
    title: 'Hạn chót nộp Giáo án tuần 26 và Kế hoạch tháng 9',
    type: 'han_giao_an',
    startDate: '2026-08-29',
    time: '17:00',
    location: 'Hệ thống Quản lý Khối B',
    leader: 'user-tt-01',
    leaderName: 'Cô Trần Thị Yến Nhi',
    description: 'Tất cả giáo viên nộp đầy đủ giáo án 5 lĩnh vực để tổ trưởng kiểm duyệt và phản hồi.',
    color: '#DC2626',
    createdAt: '2026-08-23T10:00:00Z',
  },
  {
    id: 'ev-04',
    title: 'Sinh hoạt chuyên đề: Xây dựng môi trường giáo dục lấy trẻ làm trung tâm',
    type: 'chuyen_de',
    startDate: '2026-08-30',
    time: '09:00 - 11:00',
    location: 'Hội trường MN Vỹ Dạ',
    leader: 'user-tt-01',
    leaderName: 'Cô Trần Thị Yến Nhi',
    description: 'Chia sẻ kinh nghiệm sắp xếp đồ dùng đồ chơi mở và góc tĩnh - góc động trong lớp học.',
    color: '#7C3AED',
    createdAt: '2026-08-21T15:00:00Z',
  },
  {
    id: 'ev-05',
    title: 'Khử trùng vệ sinh đồ chơi & Kiểm tra an toàn sân trường',
    type: 'hoat_dong_gd',
    startDate: '2026-08-31',
    time: '16:00 - 17:30',
    location: 'Toàn bộ 4 lớp học và sân vườn Khối B',
    leader: 'user-tp-02',
    leaderName: 'Cô Lê Thị Mai Chi',
    description: 'Vệ sinh định kỳ hàng tuần đảm bảo phòng chống dịch bệnh và an toàn tuyệt đối cho trẻ.',
    color: '#D97706',
    createdAt: '2026-08-24T08:00:00Z',
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-01',
    userId: 'user-tt-01',
    userName: 'Cô Trần Thị Yến Nhi',
    action: 'create',
    targetType: 'announcement',
    targetTitle: 'Lịch sinh hoạt chuyên môn khối B và Thao giảng tuần 25',
    details: 'Đã đăng thông báo quan trọng và ghim lên đầu bảng tin.',
    timestamp: '2026-08-24T07:30:00Z',
  },
  {
    id: 'log-02',
    userId: 'user-tp-02',
    userName: 'Cô Lê Thị Mai Chi',
    action: 'status_change',
    targetType: 'task',
    targetTitle: 'Kiểm tra vệ sinh an toàn phòng học và đồ chơi ngoài trời',
    details: 'Đã chuyển trạng thái sang "Hoàn thành" (100%).',
    timestamp: '2026-08-24T11:45:00Z',
  },
  {
    id: 'log-03',
    userId: 'user-gv-04',
    userName: 'Cô Phan Ngọc Ánh',
    action: 'progress_update',
    targetType: 'task',
    targetTitle: 'Chuẩn bị tiết thao giảng cấp Trường - Khám phá khoa học',
    details: 'Đã cập nhật tiến độ lên 75% và đính kèm file giáo án.',
    timestamp: '2026-08-24T11:15:00Z',
  },
  {
    id: 'log-04',
    userId: 'user-gv-03',
    userName: 'Cô Hoàng Thị Thảo',
    action: 'upload',
    targetType: 'lesson',
    targetTitle: 'Truyện "Giọt nước tí xíu" (Ứng dụng sa bàn nước)',
    details: 'Đã tải lên giáo án mới vào Kho Giáo án phát triển ngôn ngữ.',
    timestamp: '2026-08-23T11:00:00Z',
  },
  {
    id: 'log-05',
    userId: 'user-gv-05',
    userName: 'Cô Nguyễn Thị Bích Loan',
    action: 'status_change',
    targetType: 'task',
    targetTitle: 'Nộp báo cáo đánh giá trẻ cuối chủ đề Giao thông',
    details: 'Đã hoàn thành nộp báo cáo cho 32 trẻ Lớp Lớn 2.',
    timestamp: '2026-08-23T17:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    userId: 'all',
    title: 'Thông báo mới từ Tổ trưởng',
    message: 'Lịch sinh hoạt chuyên môn và Thao giảng tuần 25 đã được cập nhật.',
    type: 'announcement',
    linkTab: 'announcements',
    isRead: false,
    createdAt: '2026-08-24T07:30:00Z',
  },
  {
    id: 'notif-02',
    userId: 'user-gv-04',
    title: 'Nhắc nhở công việc',
    message: 'Công việc "Chuẩn bị tiết thao giảng cấp Trường" có hạn đến ngày 28/08.',
    type: 'task_due',
    linkTab: 'tasks',
    isRead: false,
    createdAt: '2026-08-24T08:00:00Z',
  },
  {
    id: 'notif-03',
    userId: 'all',
    title: 'Trao đổi chuyên môn sôi nổi',
    message: 'Cô Mai Chi vừa chia sẻ bài viết "Cách làm rối tay từ tất len cũ".',
    type: 'comment',
    linkTab: 'discussions',
    isRead: true,
    createdAt: '2026-08-23T10:00:00Z',
  },
];

// Helper to safely load or initialize storage
export class StorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  // Users
  static getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  static getCurrentUser(): User {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const users = this.getUsers();
    // Default to To Truong (nhitran04041995@gmail.com)
    const defaultUser = users.find(u => u.role === 'to_truong') || users[0] || INITIAL_USERS[0];
    this.setCurrentUser(defaultUser);
    return defaultUser;
  }

  static setCurrentUser(user: User): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Settings
  static getSettings(): AppSettings {
    return this.getItem<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static saveSettings(settings: AppSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
    window.dispatchEvent(new CustomEvent('app_settings_updated', { detail: settings }));
  }

  static getWallpaperConfig(): WallpaperConfig {
    const settings = this.getSettings();
    return settings.wallpaper || DEFAULT_WALLPAPER_CONFIG;
  }

  static saveWallpaperConfig(wallpaper: WallpaperConfig): void {
    const settings = this.getSettings();
    const updated = { ...settings, wallpaper };
    this.saveSettings(updated);
    window.dispatchEvent(new CustomEvent('app_wallpaper_updated', { detail: wallpaper }));
  }

  // Tasks
  static getTasks(): Task[] {
    return this.getItem<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  }

  static saveTasks(tasks: Task[]): void {
    this.setItem(STORAGE_KEYS.TASKS, tasks);
  }

  // Plans
  static getPlans(): Plan[] {
    return this.getItem<Plan[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  }

  static savePlans(plans: Plan[]): void {
    this.setItem(STORAGE_KEYS.PLANS, plans);
  }

  // Lesson Plans
  static getLessons(): LessonPlan[] {
    return this.getItem<LessonPlan[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSON_PLANS);
  }

  static saveLessons(lessons: LessonPlan[]): void {
    this.setItem(STORAGE_KEYS.LESSONS, lessons);
  }

  // Digital Lessons
  static getDigitalLessons(): DigitalLesson[] {
    return this.getItem<DigitalLesson[]>(STORAGE_KEYS.DIGITAL_LESSONS, INITIAL_DIGITAL_LESSONS);
  }

  static saveDigitalLessons(lessons: DigitalLesson[]): void {
    this.setItem(STORAGE_KEYS.DIGITAL_LESSONS, lessons);
  }

  // Documents
  static getDocuments(): DocumentItem[] {
    return this.getItem<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  }

  static saveDocuments(docs: DocumentItem[]): void {
    this.setItem(STORAGE_KEYS.DOCUMENTS, docs);
  }

  // Discussions
  static getDiscussions(): DiscussionPost[] {
    return this.getItem<DiscussionPost[]>(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
  }

  static saveDiscussions(posts: DiscussionPost[]): void {
    this.setItem(STORAGE_KEYS.DISCUSSIONS, posts);
  }

  // Comments
  static getComments(): DiscussionComment[] {
    return this.getItem<DiscussionComment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  }

  static saveComments(comments: DiscussionComment[]): void {
    this.setItem(STORAGE_KEYS.COMMENTS, comments);
  }

  // Calendar
  static getCalendarEvents(): CalendarEvent[] {
    return this.getItem<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
  }

  static saveCalendarEvents(events: CalendarEvent[]): void {
    this.setItem(STORAGE_KEYS.CALENDAR, events);
  }

  // Announcements
  static getAnnouncements(): Announcement[] {
    return this.getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  static saveAnnouncements(announcements: Announcement[]): void {
    this.setItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }

  // Activity Logs
  static getActivityLogs(): ActivityLog[] {
    return this.getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  }

  static saveActivityLogs(logs: ActivityLog[]): void {
    this.setItem(STORAGE_KEYS.ACTIVITY_LOGS, logs);
  }

  static addActivityLog(
    user: User,
    action: ActivityLog['action'] | string,
    targetType: string,
    targetTitle: string,
    details?: string
  ): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      action: action as any,
      targetType: targetType as any,
      targetEntity: targetType,
      targetTitle,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep last 150 logs
    this.setItem(STORAGE_KEYS.ACTIVITY_LOGS, logs.slice(0, 150));
  }

  // Notifications
  static getNotifications(): AppNotification[] {
    return this.getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  static saveNotifications(notifications: AppNotification[]): void {
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  static addNotification(
    title: string,
    message: string,
    type: AppNotification['type'],
    userId: string = 'all',
    linkTab?: string
  ): void {
    const notifs = this.getNotifications();
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      linkTab,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    this.saveNotifications(notifs);
  }

  static markAllNotificationsRead(userId?: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => {
      if (!userId || n.userId === userId || n.userId === 'all') {
        return { ...n, isRead: true };
      }
      return n;
    });
    this.saveNotifications(updated);
  }

  // Reset to Factory Default Mock Data
  static resetAllData(): void {
    localStorage.clear();
    this.saveUsers(INITIAL_USERS);
    this.saveSettings(INITIAL_SETTINGS);
    this.saveTasks(INITIAL_TASKS);
    this.savePlans(INITIAL_PLANS);
    this.saveLessons(INITIAL_LESSON_PLANS);
    this.saveDigitalLessons(INITIAL_DIGITAL_LESSONS);
    this.saveDocuments(INITIAL_DOCUMENTS);
    this.saveDiscussions(INITIAL_DISCUSSIONS);
    this.saveComments(INITIAL_COMMENTS);
    this.saveCalendarEvents(INITIAL_CALENDAR_EVENTS);
    this.saveAnnouncements(INITIAL_ANNOUNCEMENTS);
    this.setItem(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    this.setCurrentUser(INITIAL_USERS[0]);
  }

  static resetToSeedData(): void {
    this.resetAllData();
  }

  // Export full JSON database
  static exportFullBackup(): string {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      school: 'TRƯỜNG MẦM NON VỸ DẠ - KHỐI B',
      settings: this.getSettings(),
      users: this.getUsers(),
      tasks: this.getTasks(),
      plans: this.getPlans(),
      lessons: this.getLessons(),
      digitalLessons: this.getDigitalLessons(),
      documents: this.getDocuments(),
      discussions: this.getDiscussions(),
      comments: this.getComments(),
      calendarEvents: this.getCalendarEvents(),
      announcements: this.getAnnouncements(),
      activityLogs: this.getActivityLogs(),
    };
    return JSON.stringify(backup, null, 2);
  }

  static exportAllData(): string {
    return this.exportFullBackup();
  }

  // Import JSON backup
  static importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) this.saveUsers(data.users);
      if (data.settings) this.saveSettings(data.settings);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.plans) this.savePlans(data.plans);
      if (data.lessons) this.saveLessons(data.lessons);
      if (data.digitalLessons) this.saveDigitalLessons(data.digitalLessons);
      if (data.documents) this.saveDocuments(data.documents);
      if (data.discussions) this.saveDiscussions(data.discussions);
      if (data.comments) this.saveComments(data.comments);
      if (data.calendarEvents) this.saveCalendarEvents(data.calendarEvents);
      if (data.announcements) this.saveAnnouncements(data.announcements);
      if (data.activityLogs) this.setItem(STORAGE_KEYS.ACTIVITY_LOGS, data.activityLogs);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  }

  static importAllData(jsonString: string): boolean {
    return this.importBackup(jsonString);
  }
}
