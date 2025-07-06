import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/telescope/',
  build: {
    outDir: '../core/public',
    emptyOutDir: true,
  },
})