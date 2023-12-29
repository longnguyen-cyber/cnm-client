import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{ts,tsx}'
  ],
  theme: {
    screens: {
      phone: '320px',
      md: '640px',
      lg: '1024px',
      xl: '1280px'
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      animation: {
        'fade-down': 'fade-down linear',
        'fade-up': 'fade-up 0.3s linear',
        widthAnimation: ' 1s ease-in-out forwards'
      },
      keyframes: (theme) => ({
        widthAnimation: {
          '0%': {
            width: '100%'
          },
          '100% ': {
            width: ' 80%'
          }
        },
        'fade-down': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      })
    }
  },
  plugins: [require('flowbite/plugin')]
}
export default config
