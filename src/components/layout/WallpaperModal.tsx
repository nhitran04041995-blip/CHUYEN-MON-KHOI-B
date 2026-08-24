import React, { useState, useEffect } from 'react';
import {
  Image,
  Upload,
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  Sun,
  Eye,
  Layers,
  X,
  Palette,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { WallpaperConfig } from '../../types';
import { WALLPAPER_PRESETS, DEFAULT_WALLPAPER_CONFIG, WallpaperPreset } from '../../data/wallpapers';
import { Modal } from '../common/Modal';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<WallpaperConfig>(() => StorageService.getWallpaperConfig());
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = StorageService.getWallpaperConfig();
      setConfig(current);
      if (current.type === 'custom_url' && current.imageUrl) {
        setCustomUrlInput(current.imageUrl);
      }
    }
  }, [isOpen]);

  const handleSelectPreset = (preset: WallpaperPreset) => {
    const updated: WallpaperConfig = {
      presetId: preset.id,
      type: preset.gradient ? 'gradient' : 'preset',
      imageUrl: preset.imageUrl,
      overlayOpacity: preset.defaultOverlayOpacity,
      blur: preset.defaultBlur,
      overlayTheme: preset.themeTone,
    };
    setConfig(updated);
    StorageService.saveWallpaperConfig(updated);
    showToast();
  };

  const handleCustomUrlApply = () => {
    if (!customUrlInput.trim()) return;
    const updated: WallpaperConfig = {
      ...config,
      presetId: 'custom-url',
      type: 'custom_url',
      imageUrl: customUrlInput.trim(),
    };
    setConfig(updated);
    StorageService.saveWallpaperConfig(updated);
    showToast();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh (JPG, PNG, WebP, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated: WallpaperConfig = {
        ...config,
        presetId: 'custom-upload',
        type: 'custom_upload',
        imageUrl: dataUrl,
      };
      setConfig(updated);
      StorageService.saveWallpaperConfig(updated);
      showToast();
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateSetting = (partial: Partial<WallpaperConfig>) => {
    const updated: WallpaperConfig = {
      ...config,
      ...partial,
    };
    setConfig(updated);
    StorageService.saveWallpaperConfig(updated);
    showToast();
  };

  const handleResetToDefault = () => {
    setConfig(DEFAULT_WALLPAPER_CONFIG);
    StorageService.saveWallpaperConfig(DEFAULT_WALLPAPER_CONFIG);
    showToast();
  };

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🖼️ Tùy chỉnh hình nền & Không gian làm việc" size="xl">
      <div className="space-y-6">
        {/* Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/60 pb-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Chọn hình nền yêu thích hoặc tải lên hình ảnh trường lớp, vườn hoa để tạo không gian làm việc tươi vui, thân thiện cho cô giáo mầm non.
          </p>
          {saveToast && (
            <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300 animate-pulse">
              <Check className="h-3.5 w-3.5" /> Đã đổi hình nền!
            </span>
          )}
        </div>

        {/* Tab switch: Presets vs Custom */}
        <div className="flex items-center gap-2 border-b border-white/60 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            <span>Bộ sưu tập mẫu mầm non ({WALLPAPER_PRESETS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Tải ảnh lên hoặc Nhập URL</span>
          </button>
        </div>

        {/* Tab 1: Presets Grid */}
        {activeTab === 'presets' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 max-h-[340px] overflow-y-auto pr-1">
            {WALLPAPER_PRESETS.map((preset) => {
              const isSelected =
                config.presetId === preset.id ||
                (config.imageUrl && config.imageUrl === preset.imageUrl);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`group relative flex flex-col text-left rounded-2xl overflow-hidden border-2 transition-all p-1.5 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-400/40'
                      : 'border-white/80 bg-white/70 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-100">
                    {preset.gradient ? (
                      <div
                        className="h-full w-full"
                        style={{ background: preset.gradient }}
                      />
                    ) : (
                      <img
                        src={preset.thumbnailUrl}
                        alt={preset.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="p-2 space-y-1">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{preset.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Tab 2: Custom Upload / URL */
          <div className="space-y-4 rounded-2xl border border-white/80 backdrop-blur-md bg-white/60 p-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tải ảnh từ máy tính của bạn (Ảnh hoạt động trường MN Vỹ Dạ, sân trường, lớp học):
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-white/60 hover:bg-blue-50/50 transition-colors cursor-pointer text-center group">
                <Upload className="h-8 w-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-700">Nhấn để chọn ảnh hoặc kéo thả vào đây</span>
                <span className="text-[11px] text-slate-400 mt-1">Hỗ trợ định dạng JPG, PNG, WEBP (Khuyên dùng ảnh ngang 1920x1080)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-white/60">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Hoặc dán đường dẫn ảnh trực tiếp (Image URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/hinh-nen-truong-hoc.jpg"
                  className="flex-1 rounded-xl border border-white/80 backdrop-blur-md bg-white/80 px-3 py-2 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCustomUrlApply}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Adjustments Box: Glass Overlay, Blur, Tone */}
        <div className="rounded-2xl border border-white/80 backdrop-blur-md bg-white/75 p-4 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-white/60">
            <Sliders className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Tùy chỉnh hiệu ứng hiển thị & Độ mờ kính (Frosted Glass)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Overlay Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Độ phủ mờ (Dễ đọc chữ):</span>
                <span className="text-blue-600">{config.overlayOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                step="5"
                value={config.overlayOpacity}
                onChange={(e) => handleUpdateSetting({ overlayOpacity: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Rõ hình (0%)</span>
                <span>Vừa (45%)</span>
                <span>Kính dày (85%)</span>
              </div>
            </div>

            {/* Background Blur */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Độ nhòe hậu cảnh:</span>
                <span className="text-blue-600">{config.blur}px</span>
              </div>
              <div className="flex gap-1.5">
                {[
                  { label: 'Rõ nét', val: 0 },
                  { label: 'Dịu (3px)', val: 3 },
                  { label: 'Mịn (6px)', val: 6 },
                  { label: 'Sâu (10px)', val: 10 },
                ].map((b) => (
                  <button
                    key={b.val}
                    type="button"
                    onClick={() => handleUpdateSetting({ blur: b.val })}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                      config.blur === b.val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white/80 text-slate-700 border-white/80 hover:bg-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overlay Tone */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 block">Sắc thái ánh sáng:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'light_frost', label: '❄️ Kính sáng' },
                  { id: 'warm_sun', label: '☀️ Nắng ấm' },
                  { id: 'soft_pink', label: '🌸 Hồng phấn' },
                  { id: 'cool_breeze', label: '🌊 Xanh biếc' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleUpdateSetting({ overlayTheme: t.id as any })}
                    className={`py-1 px-2 rounded-xl text-[10px] font-bold border truncate transition-all ${
                      config.overlayTheme === t.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white/80 text-slate-700 border-white/80 hover:bg-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/60 pt-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 rounded-lg hover:bg-white/60 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-300/40 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Check className="h-4 w-4" />
            <span>Hoàn tất & Áp dụng</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
