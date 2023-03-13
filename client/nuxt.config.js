import colors from 'vuetify/es5/util/colors'
import { config } from 'dotenv'
config()
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - client',
    title: 'client',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS
  css: [],

  // Plugins to run before rendering page
  plugins: [{ src: '~/plugins/highcharts.js', mode: 'client' }, { src: '~/plugins/vuelidate.js', mode: 'client'}],

  // Auto import components
  components: true,

  // Modules for dev and build (recommended)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next'],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.API_DEV_BASE_URL,
  },

  // Auth module
  auth: {
    redirect: {
      home: '/',
    },
    strategies: {
      google: {
        endpoints: {
          authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
          token: process.env.GOOGLE_OAUTH_ENDPOINT_TOKEN,
          userInfo: process.env.GOOGLE_OAUTH_ENDPOINT_USERINFO,
          logout: process.env.GOOGLE_OAUTH_ENDPOINT_LOGOUT,
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 3600,
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 365,
        },
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
        logoutRedirectUri: process.env.GOOGLE_OAUTH_LOGOUT_REDIRECT_URI,
        responseType: 'code',
        accessType: 'offline',
        includeGrantedScope: true,
        codeChallengeMethod: '',
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: false,
    transpile: ['auth-next'],
  },
}
