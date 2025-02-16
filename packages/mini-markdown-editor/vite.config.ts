/// <reference types="vitest/config" />
//^与测试用同一配置

import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
// 打包后生成d.ts文件
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    plugins: [
      react() as PluginOption,
      ...(isProd ? [dts({ tsconfigPath: "./tsconfig.app.json" })] : []),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      outDir: "dist",
      lib: {
        entry: "src/index.tsx",
        name: "mini-markdown-editor",
        fileName: "mini-markdown-editor",
      },
      rollupOptions: {
        external: ["react", "react-dom", "highlight.js"],
        output: {
          chunkFileNames: `dist/chunks/[name].js`,
          inlineDynamicImports: true,
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "highlight.js": "hljs",
          },
        },
      },
    },

    //测试
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.ts",
      include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
      coverage: {
        include: ["src/components/**", "src/hooks/**", "src/utils/**", "src/store/**"],
      },
    },
  };
});
