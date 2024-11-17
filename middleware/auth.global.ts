import { useLocalStorage } from "@vueuse/core";
import type { User } from "~/types/User";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    const { path } = to;
    const [utype] = path.split("/").filter(Boolean);

    const { $api } = useNuxtApp();
    console.log(utype);
    if (utype && ["user", "org"].includes(utype)) {
        try {
            const session = useLocalStorage<{
                token: string | null;
                user: User | null;
            }>("session", () => ({
                token: null,
                user: null,
            }));
            if (!session.value.token) throw new Error("No token");
            const user = await $api<User>(`/${utype}/me`, {
                headers: {
                    Authorization: `Bearer ${session.value.token}`,
                },
            });
            session.value.user = user;
        } catch {
            return navigateTo({
                path: "/login",
                query: {
                    flowDest: to.fullPath,
                },
            });
        }
    }
});
