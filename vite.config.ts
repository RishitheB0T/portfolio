import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps every asset path relative, so the built site works on
// GitHub Pages (/portfolio/), Vercel, Netlify or any static host unchanged.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
