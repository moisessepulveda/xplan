// Paleta de colores principal de XPlan
export const colors = {
  // Brand
  primary: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#91caff',
    300: '#69b1ff',
    400: '#4096ff',
    500: '#1677ff', // Principal
    600: '#0958d9',
    700: '#003eb3',
    800: '#002c8c',
    900: '#001d66',
  },

  // Semánticos
  success: {
    light: '#f6ffed',
    main: '#52c41a',
    dark: '#389e0d',
  },
  warning: {
    light: '#fffbe6',
    main: '#faad14',
    dark: '#d48806',
  },
  error: {
    light: '#fff2f0',
    main: '#ff4d4f',
    dark: '#cf1322',
  },
  info: {
    light: '#e6f4ff',
    main: '#1677ff',
    dark: '#0958d9',
  },

  // Transacciones
  income: {
    light: '#f6ffed',
    main: '#52c41a',
    dark: '#389e0d',
    text: '#135200',
  },
  expense: {
    light: '#fff2f0',
    main: '#ff4d4f',
    dark: '#cf1322',
    text: '#820014',
  },
  transfer: {
    light: '#e6f4ff',
    main: '#1677ff',
    dark: '#0958d9',
    text: '#002c8c',
  },

  // Categorías (predefinidos)
  category: {
    home: '#fa8c16',
    food: '#eb2f96',
    transport: '#722ed1',
    entertainment: '#13c2c2',
    health: '#f5222d',
    education: '#1890ff',
    personal: '#faad14',
    savings: '#52c41a',
    salary: '#52c41a',
    freelance: '#722ed1',
    investments: '#13c2c2',
    other: '#8c8c8c',
  },

  // Créditos
  credit: {
    mortgage: '#1890ff',
    consumer: '#722ed1',
    auto: '#13c2c2',
    creditCard: '#eb2f96',
    personal: '#fa8c16',
  },

  // Estados
  status: {
    pending: '#faad14',
    partial: '#1890ff',
    paid: '#52c41a',
    overdue: '#ff4d4f',
    cancelled: '#8c8c8c',
  },

  // Neutros
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e8e8e8',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1f1f1f',
    950: '#141414',
    1000: '#000000',
  },
};

// Alias para uso rápido
export const semanticColors = {
  positive: colors.income.main,
  negative: colors.expense.main,
  neutral: colors.neutral[500],
};
