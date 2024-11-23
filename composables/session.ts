import { useLocalStorage } from "@vueuse/core";
import type { User } from "~/types/User";

export const useSession = () => {
    const session = useLocalStorage<{
        token: string | null;
        user: User | null;
    }>("session", () => ({
        token: null,
        user: null,
    }));
    return session;
};

export const useSessionToken = () => {
    return computed(() => {
        const {
            value: { token },
        } = useSession();
        return token;
    });
};

export const useSessionUser = () => {
    return computed(() => {
        const {
            value: { user },
        } = useSession();
        return user;
    });
};
