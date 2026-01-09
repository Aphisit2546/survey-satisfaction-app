import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server Configuration (Development)
  server: {
    port: 3000,
    open: true, // เปิด browser อัตโนมัติเมื่อรัน dev server
  },

  // Build Configuration (Production)
  build: {
    outDir: 'dist',
    sourcemap: false, // ปิด sourcemap ใน production
    rollupOptions: {
      output: {
        manualChunks: {
          // แยก vendor chunks สำหรับ caching ที่ดีขึ้น
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },

  // Preview Configuration
  preview: {
    port: 4173,
    open: true,
  },
});