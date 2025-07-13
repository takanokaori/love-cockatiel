import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../public',
    rollupOptions: {
      input: {
        frontpage: path.resolve(__dirname, 'src/index.html'),
      },
      output: {
        entryFileNames: 'assets/js/[name].js', // JSファイル名のパターン
        assetFileNames: ({ name }) => {
          if (/\.(png|jpe?g|svg)$/.test(name ?? '')) {
            return 'assets/img/[name][extname]'; // 画像ファイルを img ディレクトリに出力
          } else if (/\.(css)$/.test(name ?? '')) {
            return 'assets/css/[name].[hash].css'; // CSSファイル名にハッシュを追加
          }
          return 'assets/[ext]/[name][extname]'; // その他のアセットは assets ディレクトリに出力
        },
      chunkFileNames: 'assets/js/[name].js' // チャンクファイル名のパターン
      }
    }
  },
  server: {
    open: '/',
    proxy: {
      '/app': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
  plugins: [
    viteImagemin(),
    {
      postcss: {
        plugins: [
          autoprefixer()
        ]
      }
    }
  ]
});
