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
        manualChunks(id) {
          // แยก vendor chunks สำหรับ caching ที่ดีขึ้น
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@supabase/supabase-js')) {
            return 'supabase-vendor';
          }
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