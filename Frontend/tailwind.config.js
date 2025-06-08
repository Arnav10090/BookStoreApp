/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import tailwindcssLineClamp from '@tailwindcss/line-clamp';

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [daisyui, tailwindcssLineClamp],
};