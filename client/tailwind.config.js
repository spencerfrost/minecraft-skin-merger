/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'minecraft-btn': '#999999',
        'minecraft-btn-hover': 'rgba(100, 100, 255, 0.45)',
        'text-white': '#FCFCFC',
        'text-white-hover': '#FFFFA0',
        'text-gray': '#3f3f3f',
        'card': '#c6c6c6',
        'input': '#8b8b8b',
        'input-hover': '#c5c5c5',
        'card-border-top': '#ffffff',
        'card-border-bottom': '#555555',
        'input-border-top': '#555555',
        'input-border-bottom': '#FFFFFF',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'minecraft-btn': "var(--bg-minecraft-btn)",
        'minecraft-bg': "var(--bg-minecraft-bg)",
      },
      boxShadow: {
        'minecraft-btn': 'inset -2px -4px rgba(0, 0, 0, 0.4), inset 2px 2px rgba(255, 255, 255, 0.7)',
        'minecraft-btn-active': 'inset -2px -4px rgba(0, 0, 0, 0.2), inset 2px 2px rgba(255, 255, 255, 0.3)',
        'minecraft': '0 2px 0 rgba(0, 0, 0, 0.2)',
        'minecraft-inset': 'inset -2px -4px 0 0 rgba(0, 0, 0, 0.3), inset 2px 2px 0 0 rgba(255, 255, 255, 0.3)',
      },
      fontFamily: {
        'minecraft': ['MinecraftRegular', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      const newUtilities = {
        '.mc-button': {
          cursor: 'pointer',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          imageRendering: 'pixelated',
          border: '2px solid #000',
        },
        '.mc-button-title': {
          width: '100%',
          height: '100%',
          paddingBottom: '0.3em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'theme("colors.text-white")',
          textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
          boxShadow: 'theme("boxShadow.minecraft-btn")',
        },
        '.mc-button:hover .mc-button-title': {
          backgroundColor: 'theme("colors.minecraft-btn-hover")',
          textShadow: '2px 2px rgba(32, 32, 19, 0.8)',
          color: 'theme("colors.text-white-hover")',
        },
        '.mc-button:active .mc-button-title': {
          boxShadow: 'theme("boxShadow.minecraft-btn-active")',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover', 'active']);
    },
    function({ addBase, theme }) {
      addBase({
        ':root': {
          '--bg-minecraft-btn': "url('assets/optimized/minecraft-btn.jpg')",
          '--bg-minecraft-bg': "url('assets/optimized/minecraft-bg.jpg')",
          '@supports (background-image: url("assets/optimized/minecraft-btn.webp"))': {
            '--bg-minecraft-btn': "url('assets/optimized/minecraft-btn.webp')",
          },
          '@supports (background-image: url("assets/optimized/minecraft-bg.webp"))': {
            '--bg-minecraft-bg': "url('assets/optimized/minecraft-bg.webp')",
          },
        },
      });
    },
  ],
}