import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/email-verification': {
        target: 'http://3.113.6.231:3000',
        changeOrigin: true,
        // 필요하면 rewrite도 넣어라, 근데 지금은 안 써도 됨
      },
      '/api': {
        target: 'https://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false, // https 인증서 문제 있을 때
        ws: true, // 웹소켓 필요하면
      },
    },
  },
});
