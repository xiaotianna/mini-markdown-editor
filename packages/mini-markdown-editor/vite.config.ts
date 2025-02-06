/// <reference types="vitest/config" />
//^与测试用同一配置

import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
// 打包后生成d.ts文件
import dts from "vite-plugin-dts";

const pkg = JSON.parse(readFileSync("./package.json", { encoding: "utf-8" }));
// 需要排除的依赖
const externals = {
  ...(pkg?.dependencies || {}),
};

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
        external: [
          "react",
          "react-dom",
          "styled-components",
          ...Object.keys(externals),
          /@codemirror\/.*/,
          "@uiw/react-codemirror",
          "@uiw/codemirror-extensions-events",
        ],
        output: {
          chunkFileNames: `dist/chunks/[name].js`,
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "styled-components": "styled",
            zustand: "zustand",
            "@codemirror/commands": "commands",
            antd: "antd",
            "html2pdf.js": "html2pdf",
            "@emoji-mart/data": "data",
            "@emoji-mart/react": "Picker",
            "@uiw/react-codemirror": "CodeMirror",
            "@uiw/codemirror-extensions-events": "events",
            ahooks: "ahooks",
            "@codemirror/lang-markdown": "lang-markdown",
            "@codemirror/language-data": "languageData$1",
            "@codemirror/view": "view",
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
