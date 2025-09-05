module.exports = {
  content: ['./data/public/index.html', './data/frontend/**/*.{ts,js}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'oval': '50px / 30px',
      },
    },
  },
  plugins: [],
}