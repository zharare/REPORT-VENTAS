import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#403F6F',
        accent: '#FF8000',
        background: '#FFFFFF',
        surface: '#F6F7FB',
        success: '#D8F5DF',
        warning: '#FFF1DE',
      },
      boxShadow: {
        panel: '0 18px 45px rgba(64, 63, 111, 0.08)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(255,128,0,0.14), transparent 30%), radial-gradient(circle at top right, rgba(64,63,111,0.14), transparent 32%)',
      },
    },
  },
  plugins: [],
};

export default config;
