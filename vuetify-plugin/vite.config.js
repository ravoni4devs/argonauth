import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Fonts from 'unplugin-fonts/vite'
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vuetify({ autoImport: true }),
    Components({
      resolvers: [VuetifyResolver()]
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  build: {
    sourcemap: false,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'ArgonauthVuetifyPlugin',
      fileName: (format) => `argonauth-vuetify-plugin.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', 'vuetify', '@ravoni4devs/libcryptus', 'axios'],
      output: {
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify',
          axios: 'axios',
          '@ravoni4devs/libcryptus': 'Cryptus',
        },
      },
    },
  },
});
