import { defineConfig } from 'vite';
import { esmExternalRequirePlugin } from 'vite';
export default defineConfig({
    ssr: { target: 'webworker' },
    build: { ssr: 'entry.js', outDir: 'dist-fixed', minify: false },
    plugins: [esmExternalRequirePlugin({ external: [/^node:/, 'crypto'] })],
});
