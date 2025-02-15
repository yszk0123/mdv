import path from 'node:path';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config.mjs';

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      emptyOutDir: true,
      outDir: path.resolve(__dirname, '../vscode/dist/webview'),
      rollupOptions: {
        input: path.resolve(__dirname, './vscode.html'),
        output: {
          entryFileNames: 'index.js',
          manualChunks: undefined,
          assetFileNames: 'index[extname]',
        },
      },
    },
  }),
);
