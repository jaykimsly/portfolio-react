import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
          if (id.includes('framer-motion'))                          return 'vendor-motion';
          if (id.includes('@supabase'))                              return 'vendor-supabase';
          if (id.includes('@radix-ui'))                              return 'vendor-radix';
          if (id.includes('zustand'))                                return 'vendor-state';
          if (id.includes('node_modules'))                           return 'vendor';
        },
      },
    },
  },
})
