import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 개발 서버의 CORS 방지를 위한 리버스 프록시 설정 (추후 삭제)
  server: {
    proxy: {
      '/api/v1': {
        // target: 'http://i12a402.p.ssafy.io:8080',
        target: 'http://70.12.246.186:8080',
        changeOrigin: true,
      },
    },
  },
})
