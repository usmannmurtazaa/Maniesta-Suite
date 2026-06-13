/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Google Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['"Google Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                brand: ['"Agbalumo"', 'system-ui'],
                hero: ['"Playfair Display"', 'serif'],
                mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
                math: ['"STIX Two Math"', 'serif'],
            },
            fontSize: {
                'h1': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.15', fontWeight: '700' }],
                'h2': ['clamp(1.5rem, 3.5vw, 2.5rem)', { lineHeight: '1.25', fontWeight: '600' }],
                'h3': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.35', fontWeight: '600' }],
                'body': ['1rem', { lineHeight: '1.6' }],
                'body-sm': ['0.875rem', { lineHeight: '1.5' }],
                'caption': ['0.75rem', { lineHeight: '1.4' }],
            },
            colors: {
                brand: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                'gradient-hero': 'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.1) 0%, transparent 50%)',
                'mesh-gradient': 'radial-gradient(at 30% 20%, rgba(99,102,241,0.15) 0px, transparent 50%), radial-gradient(at 70% 60%, rgba(168,85,247,0.1) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(236,72,153,0.08) 0px, transparent 50%)',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0,0,0,0.06)',
                'glass-lg': '0 20px 50px -10px rgba(0,0,0,0.1)',
                'brand': '0 4px 15px rgba(99,102,241,0.4)',
                'brand-lg': '0 8px 25px rgba(99,102,241,0.5)',
                'inner-glow': 'inset 0 0 30px rgba(99,102,241,0.1)',
            },
            borderRadius: {
                '2xl': '20px',
                '3xl': '28px',
                '4xl': '36px',
            },
            animation: {
                'float': 'float 8s ease-in-out infinite',
                'float-slow': 'float 12s ease-in-out infinite',
                'gradient': 'gradientMove 20s ease infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                    '50%': { transform: 'translateY(-30px) scale(1.05)' },
                },
                gradientMove: {
                    '0%': { backgroundPosition: '0% 0%' },
                    '50%': { backgroundPosition: '100% 100%' },
                    '100%': { backgroundPosition: '0% 0%' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(99,102,241,0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(99,102,241,0.4)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};