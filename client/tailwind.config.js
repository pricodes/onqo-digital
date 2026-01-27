/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#18181b', // Zinc-900
                foreground: '#e4e4e7', // Zinc-200
                primary: {
                    DEFAULT: '#a2d033', // Lime
                    hover: '#b5e640', // Lighter Lime for hover
                },
                card: '#27272a', // Zinc-800
                border: '#3f3f46', // Zinc-700
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
