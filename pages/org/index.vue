<script lang="ts" setup>
import type { Application } from "~/types/Application";

const { $api } = useNuxtApp();

const user = useSessionUser();

const { data: applications } = await useAsyncData(
    "org-applications",
    async () => {
        const data = await $api<Application[]>("/org/applies");
        return data.filter((item) => item.job.org.id === user.value?.id);
    },
    {
        server: false,
    }
);

const pickedItemIndex = ref<number | null>(1);

const pickedItem = computed(() => {
    return applications.value &&
        pickedItemIndex.value !== null &&
        pickedItemIndex.value !== undefined
        ? applications.value[pickedItemIndex.value]
        : null;
});

const signs = {
    Стрелец: "sagittarius",
    Козерог: "capricorn",
    Водолей: "aquarius",
    Рыбы: "pisces",
    Овен: "aries",
    Телец: "taurus",
    Близнецы: "gemini",
    Рак: "cancer",
    Лев: "leo",
    Дева: "virgo",
    Весы: "libra",
    Скорпион: "scorpio",
};

const { data: suitability, execute } = await useAsyncData(
    "org-suitability",
    async () => {
        if (!pickedItem.value?.user) return null;
        const data = await $api<{
            cards: {
                name: string;
                meaning: string;
            }[];
            cosmogram: {
                sun_sign: keyof typeof signs;
                moon_sign: keyof typeof signs;
                rising_sign: keyof typeof signs;
                elements: {
                    fire: string;
                    earth: string;
                    air: string;
                    water: string;
                };
                houses: Record<string, string>;
            };
            suitability: {
                is_suitable: boolean;
                explanation: string;
            };
        }>(`/apply/suitability/${pickedItem.value?.user.id ?? 1}`, {
            method: "POST",
        });
        return data;
    },
    {
        server: false,
        lazy: true,
    }
);
const {
    data: compare,
    execute: compareExecute,
    error: compareError,
} = await useAsyncData(
    "org-compare",
    async () => {
        if (!pickedItem.value?.user) return null;
        const data = await $api<{
            best_match: {
                boss: {
                    name: string;
                    cards: { name: string; meaning: string }[];
                    cosmogram: {
                        sun_sign: string;
                        moon_sign: string;
                        rising_sign: string;
                        elements: {
                            fire: string;
                            earth: string;
                            air: string;
                            water: string;
                        };
                        houses: Record<string, string>;
                    };
                };
                compatibility: {
                    score: number;
                    explanation: string;
                };
            };
            other_matches: {
                boss: {
                    bass: string;
                    cards: { name: string; meaning: string }[];
                    cosmogram: {
                        sun_sign: string;
                        moon_sign: string;
                        rising_sign: string;
                        elements: {
                            fire: string;
                            earth: string;
                            air: string;
                            water: string;
                        };
                        houses: Record<string, string>;
                    };
                };
                compatibility: {
                    score: number;
                    explanation: string;
                };
            }[];
        }>(`/apply/compare_collective/${pickedItem.value?.user.id ?? 1}`, {
            method: "POST",
        });
        return data;
    },
    {
        server: false,
        lazy: true,
    }
);

watchEffect(() => {
    if (pickedItem.value?.user) {
        suitability.value = null;
        execute();
        compare.value = null;
        compareExecute();
        compareError.value = null;
    }
});

watch(applications, () => {
    pickedItemIndex.value = 0;
});

const acceptUser = async () => {
    try {
        const data = await $api(`/apply/${pickedItem.value?.user.id}/accept`, {
            method: "POST",
            body: {
                head_id: null,
                job_id: pickedItem.value?.job.id,
            },
        });
        applications.value =
            applications.value?.filter(
                (item) =>
                    `${item.date}-${item.user.id}` !==
                    `${pickedItem.value.date}-${pickedItem.value?.user.id}`
            ) ?? null;
        pickedItemIndex.value = 1;
    } catch {}
};
</script>

<template>
    <div class="__hire flex">
        <div
            class="overflow-auto p-8 bg-izumrud-700 transition-all duration-300 ease-in-out md:rounded-br-3xl md:rounded-tr-3xl fixed w-1/3 top-0 bottom-0 flex flex-col gap-4 z-10"
            style="padding-top: var(--header-height)"
        >
            <ClientOnly>
                <h3 class="text-2xl font-bold text-center text-white">
                    Заявки
                </h3>
                <div
                    v-for="(application, index) in applications"
                    :key="index"
                    @click="pickedItemIndex = index"
                    class="p-4 bg-carrot-400 rounded-3xl cursor-pointer"
                    data-aos="fade-right"
                    :data-aos-delay="index * 100"
                >
                    <h4 class="text-md font-semibold">
                        {{ application.user.name }}
                    </h4>
                    <p>
                        {{ application.user.professions[0] }},
                        {{
                            application.user.sex === "male"
                                ? "Мужчина"
                                : "Женшины"
                        }},
                        {{
                            new Date(
                                application.user.birthdate
                            ).toLocaleDateString("ru-RU")
                        }}, опыт - {{ application.user.experience }}
                    </p>
                </div>
            </ClientOnly>
        </div>
        <ClientOnly>
            <div
                class="pl-[33.4%] pt-6 w-full pb-6"
                data-aos="fade-up"
                data-aos-delay="200"
                v-if="pickedItem"
            >
                <div class="px-8 flex flex-col gap-8">
                    <h3 class="text-2xl font-bold text-center">Резюме</h3>
                    <div class="bg-gray-400 p-6 rounded-2xl flex text-white">
                        <div class="flex flex-col w-full">
                            <h2
                                class="text-2xl font-semibold"
                                v-for="word in pickedItem?.user.name.split(' ')"
                            >
                                {{ word }}
                            </h2>
                            <p class="mt-4 text-lg font-light">
                                {{
                                    pickedItem?.user.sex === "male"
                                        ? "Мужчина"
                                        : "Женшины"
                                }},
                                {{ pickedItem?.user.professions[0] }}
                            </p>
                        </div>
                        <div class="flex flex-col w-full gap-2">
                            <p class="text-lg font-light">
                                Дата рождения:
                                {{
                                    new Date(
                                        pickedItem.user.birthdate
                                    ).toLocaleDateString("ru-RU")
                                }}
                            </p>
                            <p class="text-lg font-light">
                                Опыт: {{ pickedItem.user.experience }}
                            </p>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="flex flex-col w-full gap-4">
                            <h4 class="text-2xl font-semibold">Навыки</h4>
                            <p class="text-xl font-light">
                                {{
                                    pickedItem.user.professions
                                        .map((text) => text.trim())
                                        .join(", ")
                                }}
                            </p>
                        </div>
                        <div class="flex flex-col w-full gap-4">
                            <h4 class="text-2xl font-semibold">Увлечения</h4>
                            <p class="text-xl font-light">
                                {{
                                    pickedItem.user.interests
                                        .map((text) => text.trim())
                                        .join(", ")
                                }}
                            </p>
                        </div>
                    </div>
                    <template v-if="suitability">
                        <!-- Cards -->
                        <div class="flex gap-2 flex-wrap w-full">
                            <div
                                class="bg-carrot-400 flex flex-col gap-4 p-4 rounded-2xl min-w-64 w-[24%]"
                                v-for="card in suitability.cards"
                            >
                                <h2 class="text-2xl font-bold">
                                    {{ card.name }}
                                </h2>
                                <p class="text-sm font-light">
                                    {{ card.meaning }}
                                </p>
                            </div>
                        </div>
                        <div class="flex w-full gap-4 justify-center">
                            <div class="flex flex-col gap-2 w-full max-w-64">
                                <h2 class="text-2xl font-semibold">Солнце</h2>
                                <div
                                    class="rounded-full aspect-[1/1] bg-primary flex flex-col gap-2 items-center justify-center w-full"
                                >
                                    <img
                                        :src="`/media/goroskop/${
                                            signs[
                                                suitability.cosmogram.sun_sign
                                            ]
                                        }.svg`"
                                        alt=""
                                        class="w-1/2"
                                    />
                                    <p class="opacity-40">
                                        {{ suitability.cosmogram.sun_sign }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2 w-full max-w-64">
                                <h2 class="text-2xl font-semibold">Луна</h2>
                                <div
                                    class="rounded-full aspect-[1/1] bg-gray-400 flex flex-col gap-2 items-center justify-center w-full"
                                >
                                    <img
                                        :src="`/media/goroskop/${
                                            signs[
                                                suitability.cosmogram.moon_sign
                                            ]
                                        }.svg`"
                                        alt=""
                                        class="w-1/2"
                                    />
                                    <p class="opacity-40">
                                        {{ suitability.cosmogram.moon_sign }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2 w-full max-w-64">
                                <h2 class="text-2xl font-semibold">Восход</h2>
                                <div
                                    class="rounded-full aspect-[1/1] bg-izumrud-700 flex flex-col gap-2 items-center justify-center w-full"
                                >
                                    <img
                                        :src="`/media/goroskop/${
                                            signs[
                                                suitability.cosmogram
                                                    .rising_sign
                                            ]
                                        }.svg`"
                                        alt=""
                                        class="w-1/2"
                                    />
                                    <p class="opacity-40">
                                        {{ suitability.cosmogram.rising_sign }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="flex">
                            <div
                                class="flex flex-col gap-3 items-center justify-center w-1/4 text-primary"
                            >
                                <UIcon
                                    name="icon-park-solid:fire"
                                    class="text-6xl"
                                />
                                <p class="text-2xl font-semibold">
                                    {{ suitability.cosmogram.elements.fire }}
                                </p>
                            </div>
                            <div
                                class="flex flex-col gap-3 items-center justify-center w-1/4 text-izumrud-700"
                            >
                                <UIcon
                                    name="solar:earth-bold"
                                    class="text-6xl"
                                />
                                <p class="text-2xl font-semibold">
                                    {{ suitability.cosmogram.elements.earth }}
                                </p>
                            </div>
                            <div
                                class="flex flex-col gap-3 items-center justify-center w-1/4 text-gray-400"
                            >
                                <UIcon
                                    name="material-symbols:air"
                                    class="text-6xl"
                                />
                                <p class="text-2xl font-semibold">
                                    {{ suitability.cosmogram.elements.air }}
                                </p>
                            </div>
                            <div
                                class="flex flex-col gap-3 items-center justify-center w-1/4 text-gray-800"
                            >
                                <UIcon
                                    name="material-symbols:water"
                                    class="text-6xl"
                                />
                                <p class="text-2xl font-semibold">
                                    {{ suitability.cosmogram.elements.water }}
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-4">
                            <div
                                class="bg-gray-800 text-white p-4 rounded-2xl space-y-2"
                                v-for="(house, _, index) in suitability
                                    .cosmogram.houses"
                            >
                                <h2 class="text-2xl font-semibold">
                                    Дом {{ index + 1 }}
                                </h2>
                                <p class="opacity-70">{{ house }}</p>
                            </div>
                        </div>
                        <hr class="border-t-black" />
                        <div class="bg-carrot-500 p-4 rounded-2xl space-y-4">
                            <UIcon
                                class="text-6xl mx-auto my-4"
                                :name="
                                    suitability.suitability.is_suitable
                                        ? 'mdi:check'
                                        : 'mdi:close'
                                "
                            />
                            <p class="text-lg font-light">
                                {{ suitability.suitability.explanation }}
                            </p>
                        </div>
                    </template>
                    <UIcon
                        name="svg-spinners:ring-resize"
                        class="text-6xl mx-auto my-8 opacity-50"
                        v-else
                    />
                    <div v-if="compare" class="space-y-4 text-white">
                        <div class="flex gap-3">
                            <div
                                class="flex flex-col items-center justify-center gap-4 w-full bg-izumrud-700 rounded-2xl p-4"
                            >
                                <h2 class="text-primary-400 font-bold text-2xl">
                                    Подходжящий руководитель
                                </h2>
                                <p>{{ compare.best_match.boss.name }}</p>
                            </div>
                            <div
                                class="flex flex-col items-center justify-center gap-4 w-full bg-izumrud-700 rounded-2xl p-4"
                            >
                                <h2 class="text-primary-400 font-bold text-2xl">
                                    Процент совместимости
                                </h2>
                                <p>
                                    {{
                                        compare.best_match.compatibility.score
                                    }}%
                                </p>
                            </div>
                        </div>
                        <div class="flex p-4 rounded-2xl bg-izumrud-700">
                            <p>
                                {{
                                    compare.best_match.compatibility.explanation
                                }}
                            </p>
                        </div>
                        <UAccordion
                            :items="
                                compare.other_matches.map((person) => ({
                                    label: `${person.boss.name} - ${person.compatibility.score}%`,
                                    content: person.compatibility.explanation,
                                }))
                            "
                        />
                    </div>
                    <UAlert
                        v-if="compareError"
                        variant="subtle"
                        color="primary"
                        icon="mdi:alert"
                        title="Ошибка сравнения!"
                        description="Не удалось сравнить сотрудника на совместимость с другими сотрудниками..."
                    />
                    <UButton
                        @click="acceptUser"
                        :ui="{
                            rounded: 'rounded-full',
                            inline: 'justify-center',
                        }"
                        class="w-full"
                        size="lg"
                    >
                        Нанять
                    </UButton>
                </div>
            </div>
        </ClientOnly>
    </div>
</template>

<style lang="scss" scoped></style>
