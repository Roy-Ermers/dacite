import { defineConfig } from 'vite';

export default defineConfig({
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
