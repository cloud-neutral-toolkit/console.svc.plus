/**
 * Tailwind CSS 配置文件
 * 使用 ES Module 格式 - 统一现代标准
 * 
 * 参考: https://tailwindcss.com/docs/configuration
 */

import typography from '@tailwindcss/typography'

const tailwindConfig = {
  // 扫描的源文件路径
  content: [
    './src/**/*.{js,ts,jsx,tsx,md}',
    './app/**/*.{js,ts,jsx,tsx,md}',
    './components/**/*.{js,ts,jsx,tsx,md}',
  ],

  darkMode: 'class',
  // 主题扩展配置
  theme: {
    extend: {
      colors: {
        border: 'var(--color-surface-border)',
        input: 'var(--color-surface-border)',
        ring: 'var(--color-ring)',
        background: 'var(--color-background)',
        foreground: 'var(--color-text)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          hover: 'var(--color-primary-hover)',
          muted: 'var(--color-primary-muted)',
          border: 'var(--color-primary-border)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          border: 'var(--color-surface-border)',
          muted: 'var(--color-surface-muted)',
          hover: 'var(--color-surface-hover)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          subtle: 'var(--color-text-subtle)',
          inverse: 'var(--color-text-inverse)',
        },
        secondary: {
          DEFAULT: 'var(--color-surface-muted)',
          foreground: 'var(--color-text)',
        },
        destructive: {
          DEFAULT: 'var(--color-danger)',
          foreground: 'var(--color-danger-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-surface-muted)',
          foreground: 'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-surface)',
          foreground: 'var(--color-text)',
        },
        card: {
          DEFAULT: 'var(--color-surface)',
          foreground: 'var(--color-text)',
        },
        brand: {
          DEFAULT: 'var(--color-primary)', // Consistent with theme
          light: 'var(--color-primary-hover)',
          dark: 'var(--color-primary-muted)',
          surface: 'var(--color-surface)',
          border: 'var(--color-surface-border)',
          navy: '#1E2E55',         // 海军蓝 - keep default
          heading: 'var(--color-heading)',
        },
      },

      // 字体配置
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      borderRadius: {
        'large': '24px',
      },

      // 自定义阴影
      boxShadow: {
        soft: '0 35px 80px -45px rgba(37, 78, 219, 0.35), 0 25px 60px -40px rgba(15, 23, 42, 0.25)',
      },
    },
  },

  // 插件
  plugins: [
    typography,
  ],
}

export default tailwindConfig
