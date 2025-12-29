/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extraído del Header y Botones "Ingresar"
        primary: {
          DEFAULT: '#1E1B4B', // Indigo muy oscuro (aprox)
          light: '#312E81',
          hover: '#17153B',
        },
        // Extraído del switch "Activo" y logo
        secondary: {
          DEFAULT: '#06B6D4', // Cyan
        },
        // Badges de estado
        success: {
          bg: '#D1FAE5', // Verde claro
          text: '#065F46', // Verde oscuro
        },
        surface: '#F3F4F6', // Gris claro para fondos
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Fuente estándar limpia
      }
    },
  },
  plugins: [],
}