import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { router } from 'sv-router/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss(), router()],
});
