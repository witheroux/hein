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
		fontFamily: {
			'text': ['Lato', 'sans-serif'],
			'title': ['Sigmar One', 'sans-serif']
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			gray: {
				100: '#F5F5F5',
				200: '#C4C4C4',
				300: '#D1CCC6',
				700: '#2D2A28',
			},
			orange: {
				50: '#FFFAF2',
				300: '#FDE0B9',
				600: '#EE8243',
			},
			purple: {
				100: '#F6EEF4',
				300: '#AC4094',
				700: '#54478B',
			},
			red: {
				500: '#EF4444',
			}
		},
		extend: {
			minHeight: {
				16: '4rem',
			},

			borderRadius: {
				"6xl": '3rem'
			},

			gridTemplateColumns: {
				"game": "minmax(300px, 1fr) 3fr"
			}
		},
	},
	plugins: [],
};
