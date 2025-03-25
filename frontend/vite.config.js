import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        includePaths: [
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, './public'),
          path.resolve(__dirname, 'node_modules')
        ]
      }
    }
  }
})
