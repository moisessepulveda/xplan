import { ThemeConfig } from 'antd';
import { colors } from './colors';

export const lightTheme: ThemeConfig = {
  token: {
    // Colores
    colorPrimary: colors.primary[500],
    colorSuccess: colors.success.main,
    colorWarning: colors.warning.main,
    colorError: colors.error.main,
    colorInfo: colors.info.main,

    // Backgrounds
    colorBgContainer: colors.neutral[0],
    colorBgElevated: colors.neutral[0],
    colorBgLayout: colors.neutral[100],
    colorBgSpotlight: colors.neutral[50],

    // Texto
    colorText: colors.neutral[800],
    colorTextSecondary: colors.neutral[600],
    colorTextTertiary: colors.neutral[500],
    colorTextQuaternary: colors.neutral[400],

    // Bordes
    colorBorder: colors.neutral[200],
    colorBorderSecondary: colors.neutral[100],

    // Tipografía
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 28,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,

    // Espaciado
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,

    // Bordes
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Sombras
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

    // Animaciones
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },
  components: {
    Button: {
      controlHeight: 44,
      controlHeightLG: 52,
      controlHeightSM: 36,
      paddingContentHorizontal: 20,
    },
    Input: {
      controlHeight: 44,
      controlHeightLG: 52,
      controlHeightSM: 36,
    },
    Select: {
      controlHeight: 44,
    },
    Card: {
      paddingLG: 20,
    },
    List: {
      itemPadding: '12px 0',
    },
    Modal: {
      paddingContentHorizontalLG: 24,
    },
  },
};
