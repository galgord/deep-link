import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/galgord/deep-link/',  // Added leading forward slash
  plugins: [react()],
  // ... existing code ...
}) 