import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite/**/*.{js,ts,jsx,tsx,mdx}',
    '/node_modules/flowbite-react/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-down': 'fade-in linear',
      },
      keyframes: (theme) => ({
        'fade-in': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      }),
    },

    screens: {
      desktop: '2000px',
    },
  },
  plugins: [require('flowbite/plugin')],
}
export default config
