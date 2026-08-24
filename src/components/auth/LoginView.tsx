import React, { useState } from 'react';
import { School, Shield, ArrowRight, UserCheck, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_USERS } from '../../services/storage';

export const LoginView: React.FC = () => {
  const { loginWithGoogle, allUsers } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const handleQuickLogin = (email: string, name?: string) => {
    loginWithGoogle(email, name);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail) {
      loginWithGoogle(customEmail, customName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/70 rounded-3xl shadow-2xl border border-white/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Col: Hero Branding */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-600/95 via-indigo-600/95 to-purple-600/95 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle floral background pattern decoration */}
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/20 blur-2xl"></div>
          <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-pink-400/25 blur-2xl"></div>

          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-md text-3xl mb-6 border border-white/30">
              🌸
            </div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-2 border border-white/30">
              Cổng quản lý chuyên môn
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              KHỐI B <br />
              <span className="text-amber-200">MN VỸ DẠ</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-3 italic font-medium leading-relaxed">
              "Kết nối chuyên môn - Chia sẻ trách nhiệm - Đồng hành hiệu quả"
            </p>
          </div>

          <div className="my-6 space-y-3 border-t border-white/20 pt-6">
            <div className="flex items-center gap-2.5 text-xs text-blue-100">
              <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
              <span>Quản lý & theo dõi tiến độ công việc hàng ngày</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-blue-100">
              <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
              <span>Kho lưu trữ Giáo án điện tử & Tài liệu chuyên môn</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-blue-100">
              <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
              <span>Diễn đàn trao đổi nghiệp vụ & Báo cáo số hóa</span>
            </div>
          </div>

          <div className="text-[11px] text-blue-200/80">
            Hệ thống chuyên môn nội bộ • Trường Mầm Non Vỹ Dạ (TP. Huế)
          </div>
        </div>

        {/* Right Col: Google Sign In & Teacher Selection */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between backdrop-blur-xl bg-white/60">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Đăng nhập tài khoản</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đăng nhập bằng tài khoản Google / Gmail của giáo viên
                </p>
              </div>
              <span className="rounded-full bg-emerald-100/80 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 backdrop-blur-xs">
                Sẵn sàng hoạt động
              </span>
            </div>

            {/* Main Primary Google Login Button for current user */}
            <div className="mt-6">
              <button
                id="btn-google-login-primary"
                type="button"
                onClick={() => handleQuickLogin('nhitran04041995@gmail.com', 'Cô Trần Thị Yến Nhi')}
                className="w-full flex items-center justify-center gap-3 rounded-2xl backdrop-blur-md bg-white/80 border border-white/90 p-3.5 text-sm font-bold text-slate-800 shadow-sm hover:bg-white hover:border-blue-300 active:scale-98 transition-all group"
              >
                {/* Google Colored Icon */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Tiếp tục với Google (nhitran04041995@gmail.com)</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick selector for all teachers in Block B */}
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-slate-200/60 w-full"></div>
                <span className="backdrop-blur-sm bg-white/70 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider rounded-full border border-white/80">
                  Hoặc chọn tài khoản giáo viên trong tổ
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickLogin(user.email, user.name)}
                    className="flex items-center justify-between p-2.5 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 hover:border-blue-300 hover:bg-white/90 transition-all text-left group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                            {user.name}
                          </p>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                              user.role === 'to_truong'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-teal-50 text-teal-700'
                            }`}
                          >
                            {user.role === 'to_truong' ? 'Tổ trưởng' : 'Giáo viên'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      Đăng nhập →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Google account login toggle */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowManualInput(!showManualInput)}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 underline"
              >
                {showManualInput ? 'Ẩn ô nhập Gmail khác' : '+ Đăng nhập bằng tài khoản Gmail khác'}
              </button>

              {showManualInput && (
                <form onSubmit={handleFormSubmit} className="mt-3 p-4 rounded-3xl backdrop-blur-xl bg-white/80 border border-white/90 text-left space-y-3 shadow-lg">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Họ và tên giáo viên:</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Cô Nguyễn Thị Lan"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none backdrop-blur-md"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Địa chỉ Gmail:</label>
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none backdrop-blur-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-300/40 active:scale-98 transition-all"
                  >
                    Đăng nhập ngay
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-emerald-600" /> Bảo mật thông tin nội bộ
            </span>
            <span>Phiên bản 2.0 • Khối B</span>
          </div>
        </div>
      </div>
    </div>
  );
};
