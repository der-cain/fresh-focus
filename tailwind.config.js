/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          50: '#f4f7f2',
          100: '#e6efe4',
          200: '#d1e2cd',
          300: '#b0cfac',
          400: '#8ab684',
          500: '#6a994e', // Primary
          600: '#527c3c',
          700: '#416330',
          800: '#364f2a',
          900: '#2d4124',
        },
        sage: {
          50: '#f8fbf3',
          100: '#f0f6e5',
          200: '#e2edd0',
          300: '#cfe0b4',
          400: '#b8cf92',
          500: '#a7c957', // Secondary
          600: '#86a83e',
          700: '#678230',
          800: '#53682a',
          900: '#455625',
        },
        oat: {
          50: '#fbfaf6',
          100: '#f7f4ea',
          200: '#f2e8cf', // Background
          300: '#eaddaa',
          400: '#dfcb81',
          500: '#d4b75c',
          600: '#ba9846',
          700: '#95763a',
          800: '#7a5f35',
          900: '#674f30',
        },
        persimmon: {
          50: '#fcf6f6',
          100: '#f7ebeb',
          200: '#edd9da',
          300: '#dfbabb',
          400: '#cd9395',
          500: '#bc4749', // Alert
          600: '#a33436',
          700: '#88292b',
          800: '#722425',
          900: '#612122',
        },
        loam: {
          50: '#f3f6f3',
          100: '#e4ebe4',
          200: '#cbdbca',
          300: '#a5c2a3',
          400: '#7ba279',
          500: '#5a8258',
          600: '#466845',
          700: '#386641', // Text
          800: '#30482f',
          900: '#283c27',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
