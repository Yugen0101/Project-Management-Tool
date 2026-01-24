import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
<<<<<<< HEAD
                // TaskForge Sophisticated Beige Palette
                primary: {
                    50: '#fdfcf9',   // Cream/Off-white
                    100: '#f7f3ed',  // Light beige
                    200: '#f1ede4',  // Soft beige
                    300: '#e5dec9',  // Medium beige
                    400: '#d9cfb0',  // Warm beige
                    500: '#c9b896',  // Main beige
                    600: '#b5a07d',  // Deep beige
                    700: '#9a8665',  // Dark beige
                    800: '#7d6d52',  // Darker beige
                    900: '#5c5038',  // Very dark beige
                    950: '#3d3525',  // Almost brown
                },
                accent: {
                    50: '#fef5f0',
                    100: '#fde9df',
                    200: '#fbd3c4',
                    300: '#f8b89d',
                    400: '#f39d76',
                    500: '#d97757',  // Soft terracotta (main accent)
                    600: '#c26242',  // Deeper terracotta
                    700: '#a84f35',  // Dark terracotta
                    800: '#8e4832',  // Very dark terracotta
                    900: '#5c2d20',  // Deep rust
                    950: '#2e160e',  // Almost black rust
                },
                beige: {
                    50: '#fdfcf9',
                    100: '#f7f3ed',
                    200: '#e5dec9',
                    300: '#d9cfb0',
                },
                // Status colors (softer, beige-compatible)
                status: {
                    success: '#7c9473', // Muted sage green
                    warning: '#d97757', // Terracotta
                    error: '#c85a54',   // Muted red
                    info: '#7a8fa3',    // Muted blue
                },
                priority: {
                    low: '#9a8665',
                    medium: '#d97757',
                    high: '#c26242',
                    critical: '#8e4832',
=======
                // Modern Soft Dashboard Palette
                background: '#f8fafc',
                foreground: '#0f172a',
                surface: '#ffffff',
                border: '#e2e8f0',
                primary: {
                    50: '#f5f7ff',
                    100: '#ebf0ff',
                    200: '#d9e2ff',
                    300: '#b8caff',
                    400: '#8ca6ff',
                    500: '#6366f1', // Indigo Accent
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
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
                },
                accent: {
                    blue: '#0ea5e9',
                    purple: '#a855f7',
                    emerald: '#10b981',
                    rose: '#f43f5e',
                    amber: '#f59e0b',
                },
                // Status colors
                status: {
                    overdue: '#be123c',
                    warning: '#d97706',
                    success: '#059669',
                    info: '#2563eb',
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
                'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(12px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

export default config;
