import type { Organization, Person, User } from "~/types/User";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    const { path } = to;
    const pathComponents = path.split("/").filter(Boolean);

    const { $api } = useNuxtApp();

    async function fetchUser<T extends User["utype"]>(
        utype: T,
        token: string
    ): Promise<T extends "org" ? Organization : Person> {
        const user = await $api<T extends "org" ? Organization : Person>(
            `/${utype}/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return { ...user, utype } as T extends "org" ? Organization : Person;
    }

    if (pathComponents[0] && ["user", "org"].includes(pathComponents[0])) {
        const utype = pathComponents[0] as "user" | "org";
        try {
            const session = useSession();
            if (!session.value.token) throw new Error("No token");
            const user = await fetchUser(utype, session.value.token);
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
