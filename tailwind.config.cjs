module.exports = {
	mode: "jit",
	purge: [
		"./src/**/*.{html,js,svelte,ts}",
	],
	theme: {
		screens: {
			'tablet': '640px',
			'laptop': '1024px',
			'desktop': '1280px',
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			gray: {
				100: '#F5F5F5',
				300: '#D1CCC6',
				700: '#2D2A28',
			},
			orange: {
				50: '#FFFAF2',
				300: '#FDE0B9',
				600: '#EE8243',
			},
			purple: {
				100: '#F2EDF2',
				300: '#AC4094',
				700: '#54478B',
			},
		},
		extend: {},
	},
	plugins: [],
};
