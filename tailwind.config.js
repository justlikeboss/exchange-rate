/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  plugins: [
    require('daisyui'),
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)'
      },
      fontFamily: {
        'TC': [`"Poetsen One"`, `FakePearl-Regular`, 'sans-serif', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas']
      }
    }
  }
}
