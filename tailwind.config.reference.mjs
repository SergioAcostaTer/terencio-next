/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				brand: {
					primary: '#15803d', // Green-700
					secondary: '#b91c1c', // Red-700
					accent: '#f59e0b', // Amber-500 (for offers/stars)
					dark: '#0f172a', // Slate-900
					light: '#f0fdf4', // Green-50
					surface: '#ffffff',
				},
			},
			fontFamily: {
				sans: ['Outfit', 'sans-serif'],
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out',
				'fade-in-up': 'fadeInUp 0.8s ease-out',
				'bounce-slow': 'bounce 3s infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/container-queries'),
	],
}