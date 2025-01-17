import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
// 打包后生成d.ts文件
import dts from 'vite-plugin-dts'

const pkg = JSON.parse(
  readFileSync('./package.json', { encoding: 'utf-8' }),
)
// 需要排除的依赖
const externals = {
  ...(pkg?.dependencies || {}),
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.app.json'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.tsx',
      name: 'mini-markdown-material',
      fileName: 'mini-markdown-material'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components', ...Object.keys(externals)],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled'
        }
      }
    }
  }
})
