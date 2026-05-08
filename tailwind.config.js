import colors from 'tailwindcss/colors'

// 🎨 Cambia solo esta línea para cambiar toda la paleta del proyecto.
// Opciones: colors.rose | colors.pink | colors.violet | colors.sky |
//           colors.emerald | colors.amber | colors.teal | colors.indigo
const brand = colors.green

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:          brand[600],
        secondary:        brand[800],
        accent:           brand[700],
        background:       brand[500],
        'text-primary':   '#333333',
        'text-secondary': '#666666',
      }
    },
  },
  plugins: [],
}
