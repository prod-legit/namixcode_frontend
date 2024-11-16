<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import type { User } from "~/types/User";
const {
    params: { utype },
} = useRoute();

const tabs = [
    {
        label: "Соискатель",
        key: "user",
    },
    {
        label: "Работодатель",
        key: "org",
    },
];

const loginState = reactive({
    email: "",
    password: "",
});

const loginStateValid = computed(() => {
    return loginState.email.length > 0 && loginState.password.length > 0;
});

const toast = useToast();
const route = useRoute();
const router = useRouter();

const loginSubmit = async (picked: "user" | "org") => {
    try {
        const { token } = await $api<{ token: string; type: string }>(
            `/api/${picked}/login`,
            {
                method: "POST",
                body: {
                    email: loginState.email,
                    password: loginState.password,
                },
            }
        );
        toast.add({
            color: "green",
            title: "Успешный вход",
            description: "Вы успешно вошли в систему",
            icon: "line-md:check-twotone",
        });

        const session = useLocalStorage<{
            token: string | null;
            user: User | null;
        }>("session", () => ({
            token: null,
            user: null,
        }));

        session.value.token = token;

        const user = await $api<User>(`/api/${picked}/me`);

        router.push((route.query.flowDest as string | undefined) ?? "/");

        toast.add({
            color: "green",
            title: `Добро пожаловать, ${
                picked === "user" ? user.fullName : ""
            }`,
            description: "Вы успешно вошли в систему",
            icon: "line-md:check-twotone",
        });
    } catch (err) {
        toast.add({
            color: "flamingo",
            title: "Ошибка входа",
            description: (err as Error).message,
            icon: "line-md:alert-twotone",
        });
    }
};
const { $api } = useNuxtApp();
</script>

<template>
    <div class="__register flex flex-col md:flex-row-reverse">
        <div
            class="w-full md:w-1/2 flex items-center justify-center bg-flamingo-500 md:h-screen rounded-bl-2xl rounded-br-2xl md:rounded-br-none md:rounded-tl-2xl"
        >
            <img
                class="w-1/2 object-contain aspect-square max-w-[500px] rounded-full hover:scale-105 transition-transform duration-1000 select-none ease-in-out"
                src="/media/auth/4.png"
                alt="Графика"
            />
        </div>
        <div class="w-full md:w-1/2 p-12">
            <UTabs :items="tabs">
                <template #item="{ item }">
                    <div class="space-y-4 py-6">
                        <div class="space-y-3">
                            <h1 class="text-3xl font-bold">Вход</h1>
                            <p>
                                Ещё нет аккаунта?
                                <UButton
                                    variant="link"
                                    color="blue"
                                    :to="{
                                        path: '/register',
                                        query: route.query,
                                    }"
                                    >Зарегистрироваться</UButton
                                >
                            </p>
                        </div>

                        <div class="space-y-3">
                            <UFormGroup label="Почта">
                                <UInput
                                    type="email"
                                    placeholder="abobus@example.com"
                                    v-model="loginState.email"
                                    size="lg"
                                />
                            </UFormGroup>
                            <UFormGroup label="Пароль">
                                <UInput
                                    type="password"
                                    placeholder="Введите пароль"
                                    v-model="loginState.password"
                                    size="lg"
                                />
                            </UFormGroup>
                            <UButton
                                class="w-full"
                                :ui="{
                                    inline: 'justify-center',
                                    rounded: 'rounded-full',
                                }"
                                size="lg"
                                :disabled="!loginStateValid"
                                @click="loginSubmit(item.key as 'user' | 'org')"
                            >
                                Войти
                            </UButton>
                        </div>
                    </div>
                </template>
            </UTabs>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
