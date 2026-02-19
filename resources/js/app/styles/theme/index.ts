import { ThemeConfig } from 'antd';
import { lightTheme } from './light';
import { darkTheme } from './dark';
import { colors, semanticColors } from './colors';

export { colors, semanticColors };

export type ThemeMode = 'light' | 'dark' | 'system';

export const themes: Record<'light' | 'dark', ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (mode: 'light' | 'dark'): ThemeConfig => themes[mode];

// Tokens CSS personalizados para uso fuera de Ant Design
export const cssVariables = {
  light: {
    '--color-income': colors.income.main,
    '--color-income-bg': colors.income.light,
    '--color-expense': colors.expense.main,
    '--color-expense-bg': colors.expense.light,
    '--color-transfer': colors.transfer.main,
    '--color-transfer-bg': colors.transfer.light,
    '--color-bg-page': colors.neutral[100],
    '--color-bg-card': colors.neutral[0],
    '--color-text-primary': colors.neutral[800],
    '--color-text-secondary': colors.neutral[600],
    '--color-border': colors.neutral[200],
  },
  dark: {
    '--color-income': colors.income.main,
    '--color-income-bg': 'rgba(82, 196, 26, 0.1)',
    '--color-expense': colors.expense.main,
    '--color-expense-bg': 'rgba(255, 77, 79, 0.1)',
    '--color-transfer': colors.transfer.main,
    '--color-transfer-bg': 'rgba(22, 119, 255, 0.1)',
    '--color-bg-page': colors.neutral[950],
    '--color-bg-card': colors.neutral[900],
    '--color-text-primary': colors.neutral[100],
    '--color-text-secondary': colors.neutral[400],
    '--color-border': colors.neutral[700],
  },
};
