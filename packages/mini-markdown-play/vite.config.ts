import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
console.log(fileURLToPath(new URL('./src', import.meta.url)));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // alias: {
    //   '@src': fileURLToPath(new URL('./src', import.meta.url))
    // }
  }
})
