export default defineNuxtPlugin((nuxtApp) => {
    const session = useSession();
    const api = $fetch.create({
        baseURL: "https://starlink.lysmux.dev/api",
        onRequest({ options }) {
            if (session.value?.token) {
                options.headers.set(
                    "Authorization",
                    `Bearer ${session.value?.token}`
                );
                options.headers.set("ngrok-skip-browser-warning", "69420");
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
