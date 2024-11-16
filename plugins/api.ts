import { useLocalStorage } from "@vueuse/core";

export default defineNuxtPlugin((nuxtApp) => {
    const session = useLocalStorage("session", () => ({
        token: null,
        user: null,
    }));
    const api = $fetch.create({
        baseURL: "https://ram-loved-eagle.ngrok-free.app",
        onRequest({ request, options, error }) {
            if (session.value?.token) {
                // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
                options.headers.set(
                    "Authorization",
                    `Bearer ${session.value?.token}`
                );
            }
        },
        async onResponseError({ response, error }) {
            await nuxtApp.runWithContext(() =>
                useToast().add({
                    icon: "line-md:alert-twotone",
                    title: `API Error | ${response.status}`,
                    description: response.statusText,
                    color: "flamingo",
                })
            );
        },
    });

    // Expose to useNuxtApp().$api
    return {
        provide: {
            api,
        },
    };
});
