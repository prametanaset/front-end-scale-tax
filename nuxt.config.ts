// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/css/tailwind.css"],
  ssr: true,
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    plugins: [
      tailwindcss(),
    ],
  },

  app: {
    head: {
      title: "Sunscaleup", // default fallback title
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "mobile-web-app-capable", content: "yes"},
        { name: "apple-mobile-web-app-capable", content: "yes"},
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "description", content: "Nuxt 4 Shadcn UI Example" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  modules: [
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/html-validator",
    '@nuxtjs/google-fonts',
    "@vite-pwa/nuxt"
  ],

  $development: {
    experimental: {
      defaults: {
        nuxtLink: {
          prefetch: false,
        },
      },
    },
  },

  googleFonts: {
    families: {
      "IBM Plex Sans Thai": {
        wght: [100, 200, 300, 400, 500, 600, 700],
      },
      Poppins: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        ital: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      "Noto Sans Thai": {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
    },
    display: "swap",
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "app/components/ui",
  },

  colorMode: {
    classSuffix: "",
  },

  htmlValidator: {
    usePrettier: true,
    logLevel: 'verbose',
    failOnError: false,
    /** A list of routes to ignore (that is, not check validity for). */
    ignore: [/\.(xml|rss|json)$/],
    options: {
      extends: [
        'html-validate:document',
        'html-validate:recommended',
        'html-validate:standard'
      ],
      rules: {
        'svg-focusable': 'off',
        'no-unknown-elements': 'error',
        // Conflicts or not needed as we use prettier formatting
        'void-style': 'off',
        'no-trailing-whitespace': 'off',
        // Conflict with Nuxt defaults
        'require-sri': 'off',
        'attribute-boolean-style': 'off',
        'doctype-style': 'off',
        // Unreasonable rule
        'no-inline-style': 'off',
        'no-autoplay': 'off',
      }
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true,

    devOptions: {
      enabled: true, 
      type: 'module'
    },

    client: {
      registerPlugin: true,
      installPrompt: true, 
    },

    manifest: {
      name: "sunscaleup",
      short_name: "sunscaleup",
      theme_color: "#f1f5f9",
      icons: [
        {
          src: "/Icon.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/Icon.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
  
});