import { ThemeConfig } from 'antd';
import { colors } from './colors';

export const darkTheme: ThemeConfig = {
  token: {
    // Colores
    colorPrimary: colors.primary[400],
    colorSuccess: colors.success.main,
    colorWarning: colors.warning.main,
    colorError: colors.error.main,
    colorInfo: colors.info.main,

    // Backgrounds
    colorBgContainer: colors.neutral[900],
    colorBgElevated: colors.neutral[800],
    colorBgLayout: colors.neutral[950],
    colorBgSpotlight: colors.neutral[800],

    // Texto
    colorText: colors.neutral[100],
    colorTextSecondary: colors.neutral[300],
    colorTextTertiary: colors.neutral[400],
    colorTextQuaternary: colors.neutral[500],

    // Bordes
    colorBorder: colors.neutral[700],
    colorBorderSecondary: colors.neutral[800],

    // Tipografía
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,

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
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 9px 28px 8px rgba(0, 0, 0, 0.2)',
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
  },
};
