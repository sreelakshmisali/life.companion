export type ThemeId =
  | 'sageGarden'
  | 'sakuraMorning'
  | 'moonlight'
  | 'rainyCafe'
  | 'cloudNine'
  | 'oceanBreeze'
  | 'autumnCabin'
  | 'cozyLibrary'
  | 'springBloom';

export interface Theme {
  id: ThemeId;
  label: string;
  emoji: string;
  isDark: boolean;
  background: string;
  backgroundGradient: [string, string];
  surface: string; // card background
  surfaceAlt: string;
  orbGradient: [string, string, string];
  accent: string;
  accentSoft: string;
  textPrimary: string;
  textSecondary: string;
  textOnAccent: string;
  border: string;
}

export const themes: Record<ThemeId, Theme> = {
  sageGarden: {
    id: 'sageGarden',
    label: 'Sage Garden',
    emoji: '🌿',
    isDark: false,
    background: '#FDFBF6',
    backgroundGradient: ['#FDFBF6', '#F3F1E8'],
    surface: '#FFFFFF',
    surfaceAlt: '#F3F1E8',
    orbGradient: ['#C9DEC4', '#E3B8B4', '#F3C89E'],
    accent: '#8FAE88',
    accentSoft: '#DCE8D8',
    textPrimary: '#4A4640',
    textSecondary: '#8B8378',
    textOnAccent: '#FDFBF6',
    border: '#EDE9DE',
  },
  sakuraMorning: {
    id: 'sakuraMorning',
    label: 'Sakura Morning',
    emoji: '🌸',
    isDark: false,
    background: '#FDF6F5',
    backgroundGradient: ['#FDF6F5', '#F8E8E6'],
    surface: '#FFFFFF',
    surfaceAlt: '#F8E8E6',
    orbGradient: ['#F3C6C6', '#F3C89E', '#E8C4C4'],
    accent: '#E39B9B',
    accentSoft: '#F6DDDC',
    textPrimary: '#4F413F',
    textSecondary: '#93807D',
    textOnAccent: '#FFFBFA',
    border: '#F3E3E1',
  },
  moonlight: {
    id: 'moonlight',
    label: 'Moonlight',
    emoji: '🌙',
    isDark: true,
    background: '#232333',
    backgroundGradient: ['#232333', '#2C2C40'],
    surface: '#2B2B3D',
    surfaceAlt: '#333347',
    orbGradient: ['#8E9BD1', '#B8A6D9', '#6E7DAE'],
    accent: '#A8B4E8',
    accentSoft: '#3A3A52',
    textPrimary: '#F0EFF6',
    textSecondary: '#A5A3BD',
    textOnAccent: '#232333',
    border: '#3A3A50',
  },
  rainyCafe: {
    id: 'rainyCafe',
    label: 'Rainy Cafe',
    emoji: '🌧️',
    isDark: false,
    background: '#F1F2F2',
    backgroundGradient: ['#F1F2F2', '#E4E8EA'],
    surface: '#FFFFFF',
    surfaceAlt: '#E4E8EA',
    orbGradient: ['#B8D0DC', '#C7B8DC', '#8FA6B3'],
    accent: '#7C99A8',
    accentSoft: '#DCE6EA',
    textPrimary: '#42474A',
    textSecondary: '#828E92',
    textOnAccent: '#F8FAFA',
    border: '#E1E6E8',
  },
  cloudNine: {
    id: 'cloudNine',
    label: 'Cloud Nine',
    emoji: '☁️',
    isDark: false,
    background: '#F7F9FC',
    backgroundGradient: ['#F7F9FC', '#EAF0F7'],
    surface: '#FFFFFF',
    surfaceAlt: '#EAF0F7',
    orbGradient: ['#CBDCF0', '#E8D9F0', '#B8D8E8'],
    accent: '#8FAFD9',
    accentSoft: '#DCE7F5',
    textPrimary: '#464C57',
    textSecondary: '#8891A0',
    textOnAccent: '#FFFFFF',
    border: '#E4EBF3',
  },
  oceanBreeze: {
    id: 'oceanBreeze',
    label: 'Ocean Breeze',
    emoji: '🌊',
    isDark: false,
    background: '#F2F9F8',
    backgroundGradient: ['#F2F9F8', '#E1F0EE'],
    surface: '#FFFFFF',
    surfaceAlt: '#E1F0EE',
    orbGradient: ['#A8D8D4', '#B8D8E8', '#8FC4C0'],
    accent: '#6FB3AC',
    accentSoft: '#D6EEEB',
    textPrimary: '#3E4D4B',
    textSecondary: '#7F918E',
    textOnAccent: '#F5FCFB',
    border: '#DCEEEC',
  },
  autumnCabin: {
    id: 'autumnCabin',
    label: 'Autumn Cabin',
    emoji: '🍂',
    isDark: false,
    background: '#FBF4EC',
    backgroundGradient: ['#FBF4EC', '#F3E4D2'],
    surface: '#FFFFFF',
    surfaceAlt: '#F3E4D2',
    orbGradient: ['#E8A87C', '#D9A05C', '#C97B5C'],
    accent: '#C97B5C',
    accentSoft: '#F0D9C4',
    textPrimary: '#4C3E33',
    textSecondary: '#93796A',
    textOnAccent: '#FBF4EC',
    border: '#F0E1CE',
  },
  cozyLibrary: {
    id: 'cozyLibrary',
    label: 'Cozy Library',
    emoji: '☕',
    isDark: false,
    background: '#F6F0E8',
    backgroundGradient: ['#F6F0E8', '#EDE1D2'],
    surface: '#FFFDFA',
    surfaceAlt: '#EDE1D2',
    orbGradient: ['#C4A882', '#B08968', '#D9C4A0'],
    accent: '#A67C52',
    accentSoft: '#E8DAC4',
    textPrimary: '#453A2E',
    textSecondary: '#8A7A65',
    textOnAccent: '#F6F0E8',
    border: '#E8DBC7',
  },
  springBloom: {
    id: 'springBloom',
    label: 'Spring Bloom',
    emoji: '🌼',
    isDark: false,
    background: '#FCFAEF',
    backgroundGradient: ['#FCFAEF', '#F5EFD8'],
    surface: '#FFFFFF',
    surfaceAlt: '#F5EFD8',
    orbGradient: ['#F0D97E', '#C9DEC4', '#F3C89E'],
    accent: '#D9B84F',
    accentSoft: '#F3EAC4',
    textPrimary: '#4B4636',
    textSecondary: '#928C70',
    textOnAccent: '#4B4636',
    border: '#EFE6C7',
  },
};

export const defaultThemeId: ThemeId = 'sageGarden';
