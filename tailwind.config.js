/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ["./**/*.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            animation: {
                gradient: 'gradient 30s ease infinite',
            },
            keyframes: {
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                }
            },
            colors: {
                gray: {
                    150: '#EBEDF0',
                }
            }
        },
    },
    plugins: [],
}