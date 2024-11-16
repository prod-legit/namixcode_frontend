import { useLocalStorage } from "@vueuse/core";
import type { User } from "~/types/User";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const {
        params: { utype },
    } = to;
    const { $api } = useNuxtApp();
    if (utype) {
        try {
            const session = useLocalStorage<{
                token: string | null;
                user: User | null;
            }>("session", () => ({
                token: null,
                user: null,
            }));
            const user = await $api<User>(`/api/${utype}/me`);
            session.value.user = user;
        } catch {
            return navigateTo(`/${utype}/login`);
        }
    }
});
