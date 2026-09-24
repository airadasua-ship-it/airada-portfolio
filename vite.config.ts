import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    fs: {
      // อนุญาตให้อ่านไฟล์จาก path ที่ติด Error ได้
      allow: [
        '.',
        '/Users/airada/Desktop/public',
        '/Users/airada/Desktop/<b>public<:b>'
      ]
    }
  }
});
