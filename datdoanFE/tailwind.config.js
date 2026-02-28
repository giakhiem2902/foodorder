/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b00', // Màu cam chủ đạo cho App đặt đồ ăn
      }
    },
  },
  plugins: [],
}