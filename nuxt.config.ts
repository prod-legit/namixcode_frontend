// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@nuxt/fonts", "@nuxtjs/seo", "@nuxtjs/mdc", "nuxt-aos"],
    colorMode: {
        preference: "light",
        fallback: "light",
    },
    css: ["~/assets/scss/global.scss"],
    site: {
        name: "Starlink",
        description: "Спросите звёзды™",
    },
    app: {
        pageTransition: {
            name: "page",
            mode: "in-out",
        },
        layoutTransition: {
            name: "page",
            mode: "in-out",
        },
    },
    mdc: {
        headings: {
            anchorLinks: false,
        },
    },
    routeRules: {
        "/": {
            // redirect: "/register",
        },
    },
});