import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion':   ['framer-motion'],
          'vendor-three':    ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-radix':    ['@radix-ui/react-dialog', '@radix-ui/react-progress', '@radix-ui/react-tooltip', '@radix-ui/react-tabs'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-state':    ['zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
