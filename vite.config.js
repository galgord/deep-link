import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/deep-link/',  // Should just be the repository name
  plugins: [react()],
  // ... existing code ...
}) 