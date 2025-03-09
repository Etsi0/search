import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/search\.phadonia\.com\/api\/bang/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'bang-cache',
							expiration: {
								maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
							},
						},
					},
				],
			},
		}),
	],
	server: {
		proxy: {
			'/api/bang': {
				target: 'https://duckduckgo.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/bang/, '/bang.js'),
				configure: (proxy, _options) => {
					proxy.on('error', (err, _req, _res) => {
						console.log('proxy error', err);
					});
					proxy.on('proxyReq', (proxyReq, req, _res) => {
						console.log('Sending Request:', req.method, req.url);
					});
					proxy.on('proxyRes', (proxyRes, req, _res) => {
						console.log('Received Response from:', req.url, proxyRes.statusCode);
					});
				},
			},
		},
	},
});