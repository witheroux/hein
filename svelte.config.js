import path from 'path';
import preprocess from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import rawSvg from './plugins/rawSvg.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: {
				plugins: [
					tailwindcss,
					autoprefixer
				],
			}
		}),
	],

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [rawSvg()],
			resolve: {
				alias: {
					$stores: path.resolve('./src/stores'),
					$utils: path.resolve('./src/utils'),
					$database: path.resolve('./src/database'),
				}
			}
		}
	}
};

export default config;
