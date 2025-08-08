// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],

  vite: {
    server: {
      strictPort: false,         // if port is busy, pick next
      allowedHosts: [
        '2c5ad35b3b67.ngrok-free.app'
      ],
      hmr: {
        host: '2c5ad35b3b67.ngrok-free.app', // ensure HMR WS connects back
        protocol: 'wss'
      }
    },
    plugins: [tailwindcss()],
  },

  modules: ["shadcn-nuxt", "@nuxtjs/color-mode", "@pinia/nuxt"],

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
});
