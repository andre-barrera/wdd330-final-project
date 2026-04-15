// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  preview: {
    host: true,
    port: 10000,
    allowedHosts: [
      "all"
    ]
  }
});