import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:4000',
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	}
});
