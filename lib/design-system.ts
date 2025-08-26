// Design System Configuration
// This file contains component variants and utility functions

const designTokens = {
  // Color Palette
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['InterVariable', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    slower: '500ms ease-in-out',
  },
}

// Component Variants
const componentVariants = {
  // Button Variants
  button: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    },
    variants: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
      secondary:
        'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
      outline:
        'border border-secondary-300 bg-transparent text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500 dark:border-secondary-600 dark:text-secondary-300 dark:hover:bg-secondary-800',
      ghost:
        'bg-transparent text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500 dark:text-secondary-300 dark:hover:bg-secondary-800',
      danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    },
  },

  // Card Variants
  card: {
    base: 'rounded-xl border border-secondary-200 bg-white shadow-sm transition-all duration-200 dark:border-secondary-700 dark:bg-secondary-800',
    variants: {
      default: 'hover:shadow-md hover:border-secondary-300 dark:hover:border-secondary-600',
      elevated:
        'shadow-md hover:shadow-lg hover:border-secondary-300 dark:hover:border-secondary-600',
      interactive:
        'cursor-pointer hover:shadow-md hover:border-secondary-300 hover:scale-[1.02] dark:hover:border-secondary-600',
      glass:
        'backdrop-blur-sm bg-white/80 border-white/20 dark:bg-secondary-800/80 dark:border-secondary-700/20',
    },
  },

  // Badge Variants
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    variants: {
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
      secondary:
        'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200',
      success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
      warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
      error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200',
      accent: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
    },
  },

  // Input Variants
  input: {
    base: 'block w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm placeholder-secondary-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100 dark:placeholder-secondary-400',
    variants: {
      default: '',
      error: 'border-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-600',
      success:
        'border-success-300 focus:border-success-500 focus:ring-success-500 dark:border-success-600',
    },
  },
}

// Utility Functions
const designSystemUtils = {
  // Generate button classes
  button: (
    variant: keyof typeof componentVariants.button.variants = 'primary',
    size: keyof typeof componentVariants.button.sizes = 'md'
  ) => {
    return `${componentVariants.button.base} ${componentVariants.button.sizes[size]} ${componentVariants.button.variants[variant]}`
  },

  // Generate card classes
  card: (variant: keyof typeof componentVariants.card.variants = 'default') => {
    return `${componentVariants.card.base} ${componentVariants.card.variants[variant]}`
  },

  // Generate badge classes
  badge: (variant: keyof typeof componentVariants.badge.variants = 'primary') => {
    return `${componentVariants.badge.base} ${componentVariants.badge.variants[variant]}`
  },

  // Generate input classes
  input: (variant: keyof typeof componentVariants.input.variants = 'default') => {
    return `${componentVariants.input.base} ${componentVariants.input.variants[variant]}`
  },

  // Common layout classes
  layout: {
    container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
    section: 'py-12 sm:py-16 lg:py-20',
    grid: {
      '2': 'grid grid-cols-1 gap-6 md:grid-cols-2',
      '3': 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
      '4': 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4',
      cards: 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
    },
  },

  // Common text classes
  text: {
    h1: 'text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl',
    h2: 'text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl',
    h3: 'text-xl font-semibold tracking-tight sm:text-2xl',
    h4: 'text-lg font-semibold tracking-tight',
    body: 'text-base leading-relaxed',
    small: 'text-sm text-secondary-600 dark:text-secondary-400',
    muted: 'text-secondary-500 dark:text-secondary-400',
  },

  // Common spacing classes
  spacing: {
    section: 'py-12 sm:py-16 lg:py-20',
    container: 'px-4 sm:px-6 lg:px-8',
    stack: {
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
      xl: 'space-y-8',
    },
  },
}

// Theme-aware color utilities
const themeColors = {
  // Background colors
  bg: {
    primary: 'bg-white dark:bg-secondary-900',
    secondary: 'bg-secondary-50 dark:bg-secondary-800',
    tertiary: 'bg-secondary-100 dark:bg-secondary-700',
    glass: 'bg-white/80 backdrop-blur-sm dark:bg-secondary-800/80',
  },

  // Text colors
  text: {
    primary: 'text-secondary-900 dark:text-secondary-100',
    secondary: 'text-secondary-700 dark:text-secondary-300',
    tertiary: 'text-secondary-500 dark:text-secondary-400',
    muted: 'text-secondary-400 dark:text-secondary-500',
  },

  // Border colors
  border: {
    primary: 'border-secondary-200 dark:border-secondary-700',
    secondary: 'border-secondary-300 dark:border-secondary-600',
    accent: 'border-primary-200 dark:border-primary-700',
  },
}

// Export only the used utilities
export { componentVariants, designSystemUtils, themeColors }
