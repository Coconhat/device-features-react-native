import { Platform } from 'react-native';

const LIGHT_BASE = '#EAE8E8';
const DARK_BASE = '#14151D';

export const Colors = {
  light: {
    text: DARK_BASE,
    background: LIGHT_BASE,
    tint: DARK_BASE,
    icon: '#6F7077',
    tabIconDefault: '#6F7077',
    tabIconSelected: DARK_BASE,
    card: '#FFFFFF',
    border: '#D9D7D7',
    mutedText: '#5E5E63',
    danger: '#B23636',
  },
  dark: {
    text: LIGHT_BASE,
    background: DARK_BASE,
    tint: LIGHT_BASE,
    icon: '#9FA0A8',
    tabIconDefault: '#9FA0A8',
    tabIconSelected: LIGHT_BASE,
    card: '#1C1D27',
    border: '#2D2F3C',
    mutedText: '#B4B5BD',
    danger: '#FF8A8A',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
