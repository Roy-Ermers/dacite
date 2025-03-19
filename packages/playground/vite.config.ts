import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
		plugins: [vue()],
    build: {
	    target: "es2015"
    },
    server: {
      port: 4376,
      headers: {
	      "Cross-Origin-Opener-Policy": "same-origin",
	      "Cross-Origin-Embedder-Policy": "require-corp"
      }
    }
});
