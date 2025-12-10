/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",         // ✅ if you're using Vite
    "./src/**/*.{js,jsx}",  // ✅ make sure jsx is included
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
