/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          100: "#00A99D",
          200: "#01AA9E"
        },
        mainGray: "#4D4D4D"
      },
      screens: {
        '1xl': '1480px', 
        '1.5xl': '1560px', 
        '3xl': '1642px', 
        '4xl': '1712px',
        '5xl': '1827px',
        '6xl': '1900px',
        '7xl': '2035px',

        // Height based media queries
        'h-sm': {'raw': '(min-height: 500px)'},
        'h-md': {'raw': '(min-height: 738px)'},
        'h-lg': {'raw': '(min-height: 794px)'},
        'h-xl': {'raw': '(min-height: 844px)'},
        'h-2xl': {'raw': '(min-height: 906px)'},
        'h-3xl': {'raw': '(min-height: 1000px)'},
        'h-4xl': {'raw': '(min-height: 1060px)'},
        'h-4.5xl': {'raw': '(min-height: 1100px)'},
        'h-5xl': {'raw': '(min-height: 1150px)'},
        'h-6xl': {'raw': '(min-height: 1200px)'},
        'h-7xl': {'raw': '(min-height: 1360px)'},
      },
      fontFamily: {
        'quinn': ['QuinnRegular', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
        'manrope-bold': ['Manrope-Bold', 'sans-serif'],
        'barlow': ['Barlow-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

