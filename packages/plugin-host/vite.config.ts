import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PluginHost',
      fileName: (format) => `plugin-host.${format}.js`,
    },
    rollupOptions: {
      external: ['xbook'],
      output: {
        globals: {
          xbook: 'XBook',
        },
      },
    },
  },
  plugins: [dts({ include: ['src'] })],
});