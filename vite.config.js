import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        academics: resolve(__dirname, 'academics.html'),
        facilities: resolve(__dirname, 'facilities.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        notices: resolve(__dirname, 'notices.html'),
        contact: resolve(__dirname, 'contact.html'),
        404: resolve(__dirname, '404.html'),
      }
    }
  }
});
