<script lang="ts" setup>
import type { NuxtLinkProps } from "#app";

interface DropdownItem extends NuxtLinkProps {
    label: string;
    labelClass?: string;
    slot?: string;
    icon?: string;
    iconClass?: string;
    shortcuts?: string[];
    disabled?: boolean;
    class?: string;
    click?: (...args: any[]) => void;
}

const route = computed(() => useRoute());
const user = useSessionUser();

const links = computed(() => {
    return user.value
        ? user.value.utype === "user"
            ? [
                  {
                      label: "Вакансии",
                      to: "/user",
                  },
              ]
            : [
                  {
                      label: "Заявки",
                      to: "/org",
                  },
                  {
                      label: "Вакансии",
                      to: "/org/jobs",
                  },
              ]
        : [];
});

const toast = useToast();

const dropdownItems = computed<DropdownItem[][] | undefined>(() => {
    if (user.value) {
        if (user.value.utype === "org") {
            return [
                [
                    {
                        icon: "mdi:account",
                        label: formatUsername(user.value),
                    },
                    {
                        label: `Почта: ${user.value.email}`,
                        icon: "mdi:email",
                    },
                ],
                [
                    {
                        label: `Сфера: ${user.value.scope}`,
                        icon: "mdi:card-account-details",
                    },
                    {
                        label: `Локация: ${user.value.location}`,
                        icon: "material-symbols:android-emergency-location-service",
                    },

                    {
                        label: `Основана в ${user.value.foundation_year} году`,
                        icon: "icon-park-twotone:birthday-cake",
                    },
                ],
                [
                    {
                        label: "Выйти",
                        icon: "mdi:logout",
                        click: async () => {
                            const session = useSession();
                            session.value.token = null;
                            session.value.user = null;
                        },
                    },
                ],
            ];
        } else {
            return [
                [
                    {
                        icon: "mdi:account",
                        label: formatUsername(user.value),
                    },
                    {
                        icon: "mdi:email",
                        label: `Почта: ${user.value.email}`,
                    },
                ],
                [
                    {
                        icon: "mdi:card-account-details",
                        label: `Пол: ${
                            user.value.sex === "male" ? "Мужчина" : "Женщина"
                        }`,
                    },
                    {
                        icon: "icon-park-twotone:birthday-cake",
                        label: `Дата рождения: ${new Date(
                            user.value.birthdate
                        ).toLocaleDateString("ru-RU")}`,
                    },
                ],
                [
                    {
                        icon: "heroicons:briefcase-solid",
                        label: `Профессия: ${user.value.professions[0]}`,
                    },
                    {
                        icon: "heroicons-solid:check-badge",
                        label: `Опыт работы: ${user.value.experience}`,
                    },
                ],
                [
                    {
                        label: "Выйти",
                        icon: "mdi:logout",
                        click: async () => {
                            const session = useSession();
                            session.value.token = null;
                            session.value.user = null;
                        },
                    },
                ],
            ];
        }
    } else return undefined;
});

const AIHintState = reactive({
    enabled: false,
    response: "",
    lines: [0, 0, 0, 0, 0],
});

const generateLines = () => {
    AIHintState.lines = [];
    for (let i = 0; i < 18; i++) {
        setTimeout(() => {
            AIHintState.lines[i] = 0;
            setTimeout(() => {
                AIHintState.lines[i] = Math.random() * 50 + 50;
            }, 100);
        }, i * 500);
    }
};

const { $api } = useNuxtApp();

const getAIHint = async () => {
    AIHintState.enabled = true;
    AIHintState.response = "";
    generateLines();
    const data = await $api<{
        overall_analysis: string;
    }>("/apply/atmosphere", {
        method: "POST",
    });
    AIHintState.response = data.overall_analysis;
};
</script>

<template>
    <header>
        <UModal
            v-model="AIHintState.enabled"
            :prevent-close="!AIHintState.response"
        >
            <UCard :ui="{ background: 'bg-white dark:bg-black' }">
                <template #header>
                    <div class="flex">
                        <UButton
                            class="ml-auto"
                            color="white"
                            variant="link"
                            icon="mdi:close"
                            :disabled="!AIHintState.response"
                            @click="AIHintState.enabled = false"
                        />
                    </div>
                </template>
                <div class="flex flex-col gap-4"></div>
                <img
                    src="/media/gpt.jpg"
                    alt="Yandex GPT"
                    class="contrast-200 rounded-3xl w-full mb-4 h-32 object-cover"
                />
                <CommonMdcontain
                    v-if="AIHintState.response"
                    :value="AIHintState.response"
                />
                <div class="flex gap-2 flex-col my-6" v-else>
                    <USkeleton
                        v-for="line in AIHintState.lines"
                        class="w-full h-4 transition-all"
                        :style="{ width: `${line}%` }"
                    />
                </div>
                <UButton
                    color="white"
                    icon="svg-spinners:pulse-rings-2"
                    label="По новой"
                    @click="getAIHint"
                    :disabled="!AIHintState.response"
                />
            </UCard>
        </UModal>
        <div class="header"></div>
        <div class="header fixed z-20 w-full left-0 top-0 p-4">
            <div
                class="rounded-full h-full px-4 sm:px-6 md:px-10 flex items-center justify-between border-[3px] border-black backdrop-blur-2xl bg-white bg-opacity-30"
            >
                <NuxtLink to="/" class="select-none">
                    <img src="/media/logo.svg" alt="Логотип наймикс" />
                </NuxtLink>
                <nav class="hidden md:flex items-center h-full">
                    <UButton
                        v-for="(link, index) in links"
                        :key="index"
                        v-bind="link"
                        color="black"
                        variant="ghost"
                        class="h-full"
                    >
                        <div class="flex flex-col h-full justify-end">
                            <span class="my-auto">{{ link.label }}</span>
                            <hr
                                class="border-t border-t-primary-500 transition-all"
                                :style="{
                                    width:
                                        link.to === route.path ? '100%' : '0',
                                }"
                            />
                        </div>
                    </UButton>
                </nav>
                <ClientOnly>
                    <div class="flex items-center sm:gap-4">
                        <!-- Sign in -->
                        <UButton
                            v-if="!user"
                            color="black"
                            :ui="{ rounded: 'rounded-full' }"
                            label="Войти"
                            size="lg"
                            variant="link"
                            to="/login"
                        />
                        <UTooltip
                            text="Проанализировать атмосферу в компании"
                            v-else-if="user.utype === 'org'"
                        >
                            <UButton
                                icon="bi:magic"
                                color="izumrud"
                                @click="getAIHint()"
                            />
                        </UTooltip>
                        <!-- Register -->
                        <UDropdown
                            :items="dropdownItems"
                            :popper="{ placement: 'bottom-end' }"
                        >
                            <template #item="{ item }">
                                <div
                                    class="flex gap-2 overflow-auto no-scrollbar items-center"
                                >
                                    <UIcon
                                        :name="item.icon"
                                        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
                                    />
                                    <span class="text-nowrap w-fit">{{
                                        item.label
                                    }}</span>
                                </div>
                            </template>
                            <UButton
                                color="black"
                                :ui="{
                                    rounded: 'rounded-full',
                                    padding: {
                                        lg: 'px-2.5 py-1.5 sm:px-3.5 sm:py-2.5',
                                    },
                                }"
                                size="lg"
                                :trailing-icon="
                                    user ? 'mdi:chevron-down' : undefined
                                "
                                :to="user ? undefined : '/register'"
                            >
                                <UAvatar
                                    v-if="user?.utype === 'org'"
                                    :src="user.logo"
                                />
                                <span class="max-w-36 truncate">
                                    {{
                                        user
                                            ? formatUsername(user)
                                            : "Включайся!"
                                    }}
                                </span>
                            </UButton>
                        </UDropdown>
                    </div>
                    <template #fallback>
                        <UIcon name="svg-spinners:ring-resize" />
                    </template>
                </ClientOnly>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.header {
    height: var(--header-height);
}
</style>
