import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/Engine.ts',
            fileName: 'engine',
            formats: ['es']
        }
    }
})