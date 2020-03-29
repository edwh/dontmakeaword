require('dotenv').config()

module.exports = {
  mode: 'spa',

  /*
  ** Headers.  Include default meta tags that will apply unless overridden by individual pages.  Every page that
  * doesn't use loginRequired should consider overriding the following to something suitable:
  *
  * description
  * og:image
  * og:title
  * og:description
  * twitter:title
  * twitter:description
  * twitter:image
  *
  * All data for the SSR must be obtained in asyncData; it will then be used to render the page, and accessible
  * via the store or returned values in head().  Note that if you try to get data in an async head() then it will
  * silently fail and revert to the site default we set up here.
  */
  head: {
    title: "Don't Make A Word",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'author', name: 'author', content: 'Edward Hibbert' },
      { name: 'supported-color-schemes', content: 'light' },
      {
        hid: 'description',
        name: 'description',
        content: "Add letters - but don't make a word!"
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: "Add letters - but don't make a word!"
      },

      {
        hid: 'og:image',
        property: 'og:image',
        content: '/icon.png'
      },
      { hid: 'og:locale', property: 'og:locale', content: 'en_GB' },
      { hid: 'og:title', property: 'og:title', content: "Don't Make A Word" },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: "Don't Make A Word"
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.dontmakeaword.com'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: "Add letters to the start or end - but don't make a word!"
      },

      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: "Don't make a word!"
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: "Add letters to the start or end - but don't make a word!"
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: '/icon.png'
      },
      {
        hid: 'twitter:image:alt',
        name: 'twitter:image:alt',
        content: 'The logo'
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      { hid: 'twitter:site', name: 'twitter:site', content: 'thisisfreegle' }
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: []
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,

  /*
  ** Global CSS
  */
  css: ['@/assets/css/global.scss'],

  plugins: [
    '~/plugins/polyfills',

    // Our template formatting utils.
    '~/plugins/filters',

    // Our directives
    '~/plugins/directives',

    // Our parameters serialize differently from axios defaults
    { src: '~/plugins/axios-serializer.js' },
    { src: '~/plugins/axios-login.js' },

    // { src: '~/plugins/axios-log.js' },

    { src: '~/plugins/qs' },
    { src: '~/plugins/twemoji' },
    { src: '~/plugins/vue2-filters' },
    { src: '~/plugins/axios-token' },
    { src: '~/plugins/axios-baseurl' },
    { src: '~/plugins/dayjs' },

    // Some plugins are client-side features
    // { src: '~/plugins/vue2-google-maps.js', ssr: false },
    { src: '~/plugins/vue-awesome.js', ssr: false },
    { src: '~/plugins/vue-read-more', ssr: false },
    // { src: '~/plugins/facebook-sdk', ssr: false },
    // { src: '~/plugins/google-sdk', ssr: false },
    // { src: '~/plugins/vue-social-sharing', ssr: false },
    // { src: '~/plugins/vue-lazy-youtube-video', ssr: false },
    // { src: '~/plugins/inspectlet', ssr: false }
  ],

  polyfill: {
    // This is needed for IE11.
    features: [
      {
        require: 'mutation-observer'
      },
      {
        require: 'promise-polyfill'
      },
      {
        require: 'event-polyfill'
      },
      {
        require: 'custom-event-polyfill'
      },
      {
        require: 'array-from-polyfill'
      },
      {
        require: 'intersection-observer',
        detect: () => 'IntersectionObserver' in window
      }
    ]
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    'nuxt-polyfill',
    // '@nuxtjs/sitemap',
    '@nuxtjs/sentry',
    'bootstrap-vue/nuxt',
    'nuxt-rfg-icon',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-dayjs-module',
    '@nuxtjs/redirect-module',
    [
      '@nuxtjs/component-cache',
      {
        max: 1000,
        maxAge: 300 * 60 * 60
      }
    ]
  ],

  // We only use some of bootstrap-vue, so by listing it explicitly we can reduce our bundle size.
  bootstrapVue: {
    componentPlugins: [
      'AlertPlugin',
      'BadgePlugin',
      'ButtonPlugin',
      'ButtonGroupPlugin',
      'CardPlugin',
      'CollapsePlugin',
      'DropdownPlugin',
      'EmbedPlugin',
      'FormPlugin',
      'FormCheckboxPlugin',
      'FormFilePlugin',
      'FormGroupPlugin',
      'FormInputPlugin',
      'FormRadioPlugin',
      'FormSelectPlugin',
      'FormTextareaPlugin',
      'ImagePlugin',
      'InputGroupPlugin',
      'LayoutPlugin',
      'LinkPlugin',
      'ListGroupPlugin',
      'MediaPlugin',
      'ModalPlugin',
      'NavPlugin',
      'NavbarPlugin',
      'PopoverPlugin',
      'ProgressPlugin',
      'TabsPlugin',
      'BVToastPlugin'
    ],
    directivePlugins: [
      'VBPopoverPlugin',
      'VBTooltipPlugin',
      'VBScrollspyPlugin'
    ]
  },

  /*
  ** Axios module configuration
  */
  axios: {
    proxy: true,
    retry: {
      // Retry failed requests to give a bit more resilience to flaky networks, especially on mobile.
      // This also helps with server upgrades.
      //
      // Note that this doesn't retry requests that never complete.
      retries: 10,
      retryDelay: retryCount => {
        return retryCount * 1000
      },
      // eslint-disable-next-line handle-callback-err
      retryCondition: error => {
        return true
      },
      shouldResetTimeout: true
    }
  },

  /*
  ** Build configuration
  */
  build: {
    // analyze: true,

    // When you deploy a new version, old chunk files which hadn't yet been loaded by a client will no longer
    // exist, and may cause errors. Nuxt has some rudimentary handling for this by reloading the whole page.
    // There are some suggestions from Sentry that this doesn't always work, and there is a suggestion that
    // this is a workaround.  Even if none of that really applies, this just changes the names of the chunks, and is
    // therefore harmless.
    // https://github.com/nuxt/nuxt.js/pull/3940
    // https://stackoverflow.com/questions/59292564/nuxt-js-npm-run-build-results-in-some-js-files-being-not-found
    filenames: {
      chunk: ({ isDev }) =>
        process.env.NODE_ENV === 'development' ? '[name].js' : '[chunkhash].js'
    },

    transpile: [/^vue2-google-maps($|\/)/, 'vue-lazy-youtube-video'],

    extend(config, ctx) {
      if (process.env.NODE_ENV !== 'production') {
        config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'
      } else {
        // If we put them as files then we don't increase the bundle size.
        config.devtool = 'source-map'
      }

      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }

      config.resolve.alias['color-vars'] = 'assets/css/_color-vars.scss'
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        automaticNameDelimiter: '.',
        name: true,
        minSize: 100000, // Change this to 0 if you're debugging problems and can't see which npm package is at fault.
        maxSize: 100000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1]

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    },

    babel: {
      presets({ isServer }) {
        const targets = isServer
          ? { node: '10' }
          : {
              browsers: [
                '> 1%',
                'last 2 versions',
                'ie >= 8',
                'safari > 9',
                'ios_saf > 9'
              ]
            }
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              targets,
              corejs: 3
              // debug: process.env.NODE_ENV === 'production'
            }
          ]
        ]
      }
    },

    loaders: {
      less: { javascriptEnabled: true }
    }
  },

  env: {
    BUILD_DATE: new Date().toLocaleString()
  },

  vue: {
    config: {
      performance: true
    }
  }
}
