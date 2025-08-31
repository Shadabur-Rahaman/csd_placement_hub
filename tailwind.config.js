/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5e0f4d',
          dark: '#4a0c3b',
          light: '#7d1167',
          50: '#f9f0f7',
          100: '#f0e0ef',
          200: '#e0c0df',
          300: '#c98bb6',
          400: '#b45c94',
          500: '#9c3f75',
          600: '#812a5c',
          700: '#682049',
          800: '#5e0f4d',
          900: '#3b0930',
        },
        secondary: {
          DEFAULT: '#f8c630',
          dark: '#e0b12b',
          light: '#fad35e',
          50: '#fef9e8',
          100: '#fdf1cd',
          200: '#fbe59a',
          300: '#f8d05d',
          400: '#f5c231',
          500: '#e7a815',
          600: '#ca850f',
          700: '#a26211',
          800: '#854f16',
          900: '#704217',
        },
        accent: {
          DEFAULT: '#4bb1a5',
          dark: '#3d9a8f',
          light: '#69c2b8',
          50: '#f0f9f8',
          100: '#d9efec',
          200: '#b6e2dd',
          300: '#87cdc5',
          400: '#59b6ac',
          500: '#3e9e94',
          600: '#388079',
          700: '#306862',
          800: '#2c5550',
          900: '#274745',
        },
        gradient: {
          pink: {
            light: '#F9B0B9',
            DEFAULT: '#f472b6',
            dark: '#db2777'
          },
          violet: {
            light: '#c4b5fd',
            DEFAULT: '#8b5cf6',
            dark: '#7c3aed'
          },
          emerald: {
            light: '#6ee7b7',
            DEFAULT: '#10b981',
            dark: '#059669'
          }
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Montserrat', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px rgba(0, 0, 0, 0.08)',
        hover: '0 15px 35px rgba(0, 0, 0, 0.1)',
        btn: '0 6px 15px rgba(94, 15, 77, 0.2)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(to right, #F9B0B9, #c4b5fd, #6ee7b7)',
      }
    },
  },
  plugins: [],
} 