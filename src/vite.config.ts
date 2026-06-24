import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        storeHome: resolve(__dirname, 'src/pages/store/home/home.html'),
        storeCart: resolve(__dirname, 'src/pages/store/cart/cart.html'),
      }
    }
  },
  base: './'
})
