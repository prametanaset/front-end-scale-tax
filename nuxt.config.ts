// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: "Nuxt", // default fallback title
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Nuxt 4 Shadcn UI Example" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  modules: [
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/html-validator",
  ],

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
        'no-inline-style': 'off'
      }
    }
  }
  
});
