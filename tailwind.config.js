/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4A9B9B', // Soft Mint Teal — primary accent
          // Dark end of the brand teal range. White clears 4.5:1 here but only
          // 3.3:1 on the lighter #4A9B9B, so teal fills carrying text use this.
          'primary-dark': '#3D7A73',
          'primary-darker': '#2F5F58', // Hover for teal fills
          teal: '#55B5B3', // Teal sampled from the logo disc
          mist: '#E0F2F0', // Palest teal — product image ground
          light: '#B8E0DC', // Light teal — body text on dark teal
          forest: '#1A3D3A', // Footer gradient, top
          deep: '#0F2726', // Deep teal — hero scrim, footer gradient bottom
          gold: '#7E6B2F', // Deep gold — the one warm accent among the teal tiles
          rose: '#E88295', // Soft Rose Pink — badges / subtle highlights
          bg: '#FAFAFA', // Canvas background
          surface: '#FFFFFF', // Card / nav surface
          dark: '#1C2826', // Charcoal — headings & body-dark
          muted: '#6B7280', // Muted text
          border: '#E5E7EB', // Hairline borders
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        // Matches the logo's "Cvećara" lettering; carries latin-ext for ć/č/ž.
        script: ['"Dancing Script"', 'cursive'],
      },
      // 8pt spacing scale additions (Tailwind's 4px base already covers 8/16/24/…)
      spacing: {
        18: '4.5rem', // 72px
        22: '5.5rem', // 88px
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,40,38,0.04), 0 8px 24px -12px rgba(28,40,38,0.12)',
        drawer: '-24px 0 48px -24px rgba(28,40,38,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Slides an oversized gradient across the hero so the teal shifts
        // toward forest and back without the section ever appearing to move.
        'gradient-drift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'gradient-drift': 'gradient-drift 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
