// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	resolve: {
		alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
	},
	// server: {
	// 	// host: '127.0.0.1',
	// 	headers: {
	// 		'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
	// 		'Cross-Origin-Embedder-Policy': 'unsafe-none',
	// 	},
	// },
	plugins: [vue(), vueDevTools(), tailwindcss()],
})
