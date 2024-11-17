<script lang="ts" setup>
import type { Application } from "~/types/Application";
import type { Job } from "~/types/Job";

const { $api } = useNuxtApp();

const { data: work } = await useAsyncData("work-search", async () => {
    const data = await $api<Job[]>("/user/jobs");
    return data;
});

const query = ref("");
const filteredWork = computed(() => {
    return (
        work.value?.filter(
            (item) =>
                item.title.toLowerCase().includes(query.value.toLowerCase()) ||
                item.org.name
                    .toLowerCase()
                    .includes(query.value.toLowerCase()) ||
                item.description
                    .toLowerCase()
                    .includes(query.value.toLowerCase())
        ) || []
    );
});

const { data: applications, status } = await useAsyncData(
    "applications",
    async () => {
        const data = await $api<Application[]>("/user/applies");
        return data;
    },
    {
        server: false,
    }
);

const liveAppliedTo = ref<string[]>([]);

const appliedToJobIds = computed(() => {
    return (applications.value?.map((item) => item.job.id) || []).concat(
        liveAppliedTo.value
    );
});

const pickedItemIndex = ref<number | null>();

const pickedItem = computed(() => {
    return pickedItemIndex.value !== null && pickedItemIndex.value !== undefined
        ? filteredWork.value[pickedItemIndex.value]
        : null;
});

watch(filteredWork, () => {
    pickedItemIndex.value = null;
});

const toast = useToast();

const applyForJob = async (job: Job) => {
    try {
        liveAppliedTo.value.push(job.id);
        const data = await $api("/apply", {
            method: "POST",
            body: {
                job_id: job.id,
            },
        });
        toast.add({
            color: "green",
            icon: "mdi:check",
            title: "Заявка подана!",
        });
    } catch (err) {
        liveAppliedTo.value = liveAppliedTo.value.filter((id) => id !== job.id);
        toast.add({
            color: "flamingo",
            icon: "line-md:alert-twotone",
            title: "Не удалось подать заявку",
            description: (err as Error).message,
        });
    }
};
</script>

<template>
    <div class="__work-search flex">
        <div class="p-4 flex flex-col gap-4 w-full">
            <UInput
                size="lg"
                color="flamingo"
                placeholder="Поиск..."
                icon="mdi:search"
                v-model="query"
            />
            <WorkJob
                v-for="(item, index) in filteredWork"
                v-bind="item"
                class="cursor-pointer"
                :key="item.id"
                :applied="appliedToJobIds.includes(item.id)"
                :loading="status !== 'success'"
                :hide-btn="
                    pickedItemIndex !== null && pickedItemIndex !== undefined
                "
                @click="
                    () =>
                        pickedItemIndex === index
                            ? (pickedItemIndex = null)
                            : (pickedItemIndex = index)
                "
                @apply="applyForJob(item)"
            />
        </div>
        <div
            class="overflow-auto p-0 bg-izumrud-700 w-0 transition-all duration-300 h-screen ease-in-out md:rounded-bl-3xl md:rounded-tl-3xl fixed md:relative inset-0 md:inset-auto"
            :class="{ 'w-full': pickedItem, 'p-8': pickedItem }"
        >
            <Transition name="fade">
                <div v-if="pickedItem" class="space-y-8">
                    <div class="bg-carrot-500 p-6 rounded-2xl space-y-6">
                        <div class="flex gap-8">
                            <img
                                :src="pickedItem?.org.logo"
                                alt="Аватарка"
                                class="bg-gray-400 aspect-[1/1] w-28 rounded-xl"
                            />
                            <div class="flex flex-col g-2">
                                <h3 class="text-2xl font-semibold">
                                    {{ pickedItem.org.name }}

                                    <span class="text-sm font-light ml-2">{{
                                        pickedItem.org.foundation_year
                                    }}</span>
                                </h3>
                                <p class="font-light">
                                    {{ pickedItem.org.scope }},
                                    {{ pickedItem.org.location }}
                                </p>
                            </div>

                            <UButton
                                class="h-fit ml-auto"
                                icon="mdi:close"
                                size="lg"
                                @click="pickedItemIndex = null"
                            />
                        </div>
                        <p class="font-light">
                            {{ pickedItem.org.description }}
                        </p>
                    </div>
                    <div class="space-y-4 text-white">
                        <h3 class="text-4xl font-bold text-primary">
                            {{ pickedItem.title }}
                        </h3>
                        <p class="font-light">{{ pickedItem.pay }}</p>
                        <CommonMdcontain :value="pickedItem.description" />
                        <UButton
                            size="lg"
                            @click="applyForJob(pickedItem)"
                            :label="
                                appliedToJobIds.includes(pickedItem.id)
                                    ? 'Вы откликнулись'
                                    : status !== 'success'
                                    ? 'Проверяем'
                                    : 'Откликнуться'
                            "
                            :ui="{
                                rounded: 'rounded-full',
                                base: 'w-full',
                                inline: 'justify-center',
                            }"
                            :color="
                                appliedToJobIds.includes(pickedItem.id) ||
                                status !== 'success'
                                    ? 'gray'
                                    : 'primary'
                            "
                            :icon="
                                appliedToJobIds.includes(pickedItem.id)
                                    ? 'mdi:check'
                                    : status !== 'success'
                                    ? 'svg-spinners:ring-resize'
                                    : undefined
                            "
                            :disabled="status !== 'success'"
                        />
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    translate: 0 1rem;
}
</style>
