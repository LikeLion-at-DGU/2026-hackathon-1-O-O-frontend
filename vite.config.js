import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/lookbook-media': {
        target: 'https://hello1423.site',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/lookbook-media/,
            '/media/lookbooks',
          ),
      },
    },
  },
})
