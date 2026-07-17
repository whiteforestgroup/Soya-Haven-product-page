import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// One-off config for generating a fully self-contained preview build
// (single HTML file, everything inlined) — not used for real deploys.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-preview',
    assetsInlineLimit: 100_000_000, // inline every image as a data URI, no external asset files
    cssCodeSplit: false,
  },
})
