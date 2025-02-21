import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: "esnext",
    },
    resolve: {
        conditions: ['source'],
        alias: {
            '@': '/src'
        }
    }
});