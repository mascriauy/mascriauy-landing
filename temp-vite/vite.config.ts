import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        propuestas: resolve(__dirname, 'propuestas.html'),
        trazanet: resolve(__dirname, 'trazanet.html'),
        linea: resolve(__dirname, 'linea.html'),
      },
    },
  },
})
