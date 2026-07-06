/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // Brand palette — mirrors the CSS custom properties in index.css.
                navy: '#1C1F2A',
                mist: '#E2EAF2',
                gold: '#ECD898',
                deep: '#13294B',
            },
            keyframes: {
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(42px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'slide-up': 'slideUp 0.95s ease-out forwards',
            },
        },
    },
    plugins: [],
}
