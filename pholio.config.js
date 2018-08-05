module.exports = {
  plugins: 'src/plugins',
  layouts: 'src/layouts',
  assetPath: 'src/static',
  pages: ['src/content/**/*.md'],
  output: 'docs',
  // fallback page, usually a 404 page or error page
  errorRedirect: '/error',

  // for vue-router
  routerMode: 'hash',

  // md2vue configuration
  md2vue: {
    gistInjection: ''
  },

  // external links
  // support CSS and JavaScript urls
  externals: [
    'https://lib.baomitu.com/normalize/8.0.0/normalize.min.css',
    'https://lib.baomitu.com/highlight.js/9.12.0/styles/github.min.css',
    'https://lib.baomitu.com/KaTeX/0.9.0/katex.min.css'
  ]
}
