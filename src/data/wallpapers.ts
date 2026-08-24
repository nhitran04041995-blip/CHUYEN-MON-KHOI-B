import { WallpaperConfig } from '../types';

export interface WallpaperPreset {
  id: string;
  name: string;
  category: 'truong_hoc' | 'thien_nhien' | 'pastel' | 'gradient';
  description: string;
  thumbnailUrl: string;
  imageUrl?: string;
  gradient?: string;
  defaultOverlayOpacity: number; // in %
  defaultBlur: number; // in px
  themeTone: 'light_frost' | 'warm_sun' | 'cool_breeze' | 'soft_pink' | 'crystal_clear';
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'preset-vy-da-garden',
    name: 'Sân Trường & Vườn Hoa Tuổi Thơ',
    category: 'truong_hoc',
    description: 'Không gian xanh mát ngập tràn sắc hoa và ánh nắng mầm non tươi vui',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1920',
    defaultOverlayOpacity: 45,
    defaultBlur: 3,
    themeTone: 'warm_sun',
  },
  {
    id: 'preset-classroom-warm',
    name: 'Lớp Học Mầm Non Sắc Màu',
    category: 'truong_hoc',
    description: 'Lớp học thân thương với góc học tập, đồ dùng trực quan rực rỡ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=1920',
    defaultOverlayOpacity: 45,
    defaultBlur: 4,
    themeTone: 'light_frost',
  },
  {
    id: 'preset-pastel-sky',
    name: 'Bầu Trời Mộng Mơ & Mây Hồng',
    category: 'pastel',
    description: 'Mây trời pastel dịu êm tạo cảm giác thư thái và nhẹ nhàng khi làm việc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1920',
    defaultOverlayOpacity: 35,
    defaultBlur: 2,
    themeTone: 'soft_pink',
  },
  {
    id: 'preset-rainbow-art',
    name: 'Sắc Màu Hội Họa & Đồ Chơi',
    category: 'truong_hoc',
    description: 'Bút màu, tranh vẽ và sáng tạo thủ công của cô và trò',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1920',
    defaultOverlayOpacity: 45,
    defaultBlur: 4,
    themeTone: 'warm_sun',
  },
  {
    id: 'preset-nature-green',
    name: 'Vườn Cây Xanh Mát Vỹ Dạ',
    category: 'thien_nhien',
    description: 'Rặng cây xanh thanh bình mang vẻ đẹp xứ Huế mộng mơ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1920',
    defaultOverlayOpacity: 45,
    defaultBlur: 3,
    themeTone: 'cool_breeze',
  },
  {
    id: 'preset-gradient-aurora',
    name: 'Gradient Cực Quang Pastel (Mặc định)',
    category: 'gradient',
    description: 'Pha trộn êm dịu 3 tông màu xanh pastel, hồng baby và vàng nắng nhạt',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=400',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #fce7f3 50%, #fef3c7 100%)',
    defaultOverlayOpacity: 20,
    defaultBlur: 0,
    themeTone: 'light_frost',
  },
  {
    id: 'preset-gradient-blossom',
    name: 'Gradient Hoa Anh Đào & Cẩm Tú Cầu',
    category: 'gradient',
    description: 'Tông hồng phấn và tím nhạt ngọt ngào, ấm cúng',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=400',
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 45%, #ede9fe 100%)',
    defaultOverlayOpacity: 20,
    defaultBlur: 0,
    themeTone: 'soft_pink',
  },
  {
    id: 'preset-gradient-ocean-mint',
    name: 'Gradient Biển Xanh & Bạc Hà',
    category: 'gradient',
    description: 'Tông xanh bạc hà và ngọc bích mát mẻ, hiện đại',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=400',
    gradient: 'linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 50%, #dbeafe 100%)',
    defaultOverlayOpacity: 20,
    defaultBlur: 0,
    themeTone: 'cool_breeze',
  },
];

export const DEFAULT_WALLPAPER_CONFIG: WallpaperConfig = {
  presetId: 'preset-gradient-aurora',
  type: 'preset',
  imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1920',
  overlayOpacity: 40,
  blur: 3,
  overlayTheme: 'light_frost',
};
