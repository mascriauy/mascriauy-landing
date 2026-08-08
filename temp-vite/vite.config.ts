import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        propuestas: resolve(__dirname, 'propuestas.html'),
        trazanet: resolve(__dirname, 'trazanet.html'),
        // Documentos legales. Son entradas del build y no archivos sueltos de
        // `public/` porque usan el sistema de la home: fuera del build no
        // reciben el CSS con hash y habría que mantener una copia aparte.
        privacidad: resolve(__dirname, 'privacidad.html'),
        terminos: resolve(__dirname, 'terminos-y-condiciones.html'),
        copyright: resolve(__dirname, 'copyright.html'),
        soporte: resolve(__dirname, 'soporte.html'),
      },
    },
  },
})
