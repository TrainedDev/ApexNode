import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   proxy: {
  //     // 💡 Catch any request starting with /api/v1
  //     '/api/v1': {
  //       target: 'http://localhost:5000', // Your Express API Gateway Port
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // }, 
})
