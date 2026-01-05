/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#007bff',
        'primary-blue-dark': '#0056b3',
        'light-blue-bg': '#f0f7ff',
        'white-bg': '#ffffff',
        'text-dark': '#212529',
        'text-muted': '#6c757d',
        'border-color': '#e9ecef',
        'success-bg': '#e6f9f0',
        'success-text': '#1b8754',
        'success-border': '#b3e5cd',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

