<script lang="ts" setup>
import type { Job } from "~/types/Job";

const { $api } = useNuxtApp();

const { data: jobs, refresh: refreshJobs } = await useAsyncData(
    "org-jobs",
    async () => {
        const data = await $api<Job[]>("/org/jobs");
        return data;
    }
);

const query = ref("");
const filteredJobs = computed(() => {
    return (
        jobs.value?.filter(
            (item) =>
                item.title.toLowerCase().includes(query.value.toLowerCase()) ||
                item.description
                    .toLowerCase()
                    .includes(query.value.toLowerCase())
        ) || []
    );
});

const pickedItemIndex = ref<number | null>();

const pickedItem = computed(() => {
    // Special value for creating a new job
    if (pickedItemIndex.value === -1) {
        return "new";
    }
    return pickedItemIndex.value !== null && pickedItemIndex.value !== undefined
        ? filteredJobs.value[pickedItemIndex.value]
        : null;
});

watch(filteredJobs, () => {
    pickedItemIndex.value = null;
});

const newItem = reactive<Partial<Job>>({
    title: "",
    pay: "",
    description: "",
});

const createNewItem = async () => {
    await $api("/org/job", {
        method: "POST",
        body: newItem,
    });
    newItem.title = "";
    newItem.pay = "";
    newItem.description = "";
    pickedItemIndex.value = null;
    refreshJobs();
};
</script>

<template>
    <div class="__jobs flex">
        <div class="p-4 flex flex-col gap-4 w-full">
            <UInput
                size="lg"
                color="flamingo"
                placeholder="Поиск..."
                icon="mdi:search"
                v-model="query"
            />
            <UButton
                size="lg"
                label="Создать новую вакансию"
                @click="pickedItemIndex = -1"
                class="mt-4"
            />
            <WorkJob
                v-for="(item, index) in filteredJobs"
                v-bind="item"
                :key="item.id"
                :hide-btn="true"
                @click="
                    () =>
                        pickedItemIndex === index
                            ? (pickedItemIndex = null)
                            : (pickedItemIndex = index)
                "
            />
        </div>
        <div
            class="overflow-auto p-0 bg-gray-200 w-0 transition-all duration-300 ease-in-out md:rounded-bl-3xl md:rounded-tl-3xl fixed md:relative inset-0 md:inset-auto text-gray-800"
            :class="{ 'w-full': pickedItem, 'p-8': pickedItem }"
            style="height: calc(100vh - var(--header-height))"
        >
            <Transition name="fade">
                <div v-if="pickedItem" class="space-y-8">
                    <div v-if="pickedItem === 'new'" class="space-y-4">
                        <UFormGroup label="Название вакансии">
                            <UInput
                                placeholder="Рекрутер"
                                v-model="newItem.title"
                            />
                        </UFormGroup>
                        <UFormGroup label="Зарплата">
                            <UInput
                                placeholder="1000$ / месяц"
                                v-model="newItem.pay"
                            />
                        </UFormGroup>
                        <UFormGroup
                            label="Описание"
                            help="Допускается формат Markdown"
                        >
                            <UTextarea
                                v-model="newItem.description"
                                placeholder="# Hello world in markdown!"
                            />
                        </UFormGroup>
                        <UFormGroup label="Предпросмотр описания">
                            <UCard>
                                <CommonMdcontain
                                    v-if="newItem.description"
                                    :value="newItem.description ?? ''"
                                />
                            </UCard>
                        </UFormGroup>
                        <UButton
                            label="Создать"
                            @click="createNewItem"
                            :disabled="
                                !newItem.title ||
                                !newItem.pay ||
                                !newItem.description
                            "
                            color="flamingo"
                        />
                    </div>
                    <div v-else>
                        <!-- Display job details -->
                        <h2 class="text-2xl font-bold">
                            {{ pickedItem.title }}
                        </h2>
                        <CommonMdcontain
                            v-if="pickedItem.description"
                            :value="pickedItem.description"
                        />
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
