/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'principal': '#4318FF',
        'texto': '#2B3674',
        'textogris': '#A3AED0',
        'borders': '#E0E5F2',
        "borders2": '#E9EDF7',
        "green": "#37B63C",
        "red": "#FF1818"
      },
      fontFamily: {
        primaria: 'DM_SANS',
      },
      backgroundImage: {
        'login': "url('/img/loginBG.svg')",
        'callflowlogo': "url('/img/callflowLogo.svg')",
      }
    },
  },
  plugins: [],
};
