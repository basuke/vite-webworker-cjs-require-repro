import { defineConfig } from 'vite';
export default defineConfig({
    ssr: { target: 'webworker' },
    build: { ssr: 'entry.js', outDir: 'dist', minify: false },
});
