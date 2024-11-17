<script lang="ts" setup>
import type { Job } from "~/types/Job";

const props = defineProps<
    Job | { applied: boolean; loading: boolean; hideBtn: boolean }
>();
const emit = defineEmits(["apply"]);

const applyForJob = (event: MouseEvent) => {
    event.stopPropagation();
    if (props.applied) return;
    emit("apply");
};
</script>

<template>
    <div class="__job">
        <UCard
            :ui="{
                background: 'bg-izumrud-700',
                rounded: 'rounded-3xl',
                body: { padding: '!px-4 !py-4' },
            }"
        >
            <div class="flex gap-4 text-white flex-wrap">
                <img
                    :src="org.logo"
                    alt="Аватарка"
                    class="bg-gray-400 aspect-[1/1] w-20 rounded-xl"
                />
                <div class="flex flex-col">
                    <p>{{ org.name }}</p>
                    <h3 class="text-flamingo-500 md:text-2xl font-bold">
                        {{ title }}
                    </h3>
                </div>
                <div class="flex flex-col justify-between ml-auto items-end">
                    <p>{{ pay }}</p>
                    <UButton
                        v-show="!hideBtn"
                        @click="applyForJob"
                        :label="
                            applied
                                ? 'Вы откликнулись'
                                : loading
                                ? 'Проверяем'
                                : 'Откликнуться'
                        "
                        :ui="{ rounded: 'rounded-full' }"
                        :color="applied || loading ? 'gray' : 'primary'"
                        :icon="
                            applied
                                ? 'mdi:check'
                                : loading
                                ? 'svg-spinners:ring-resize'
                                : undefined
                        "
                        :disabled="loading"
                    />
                </div>
            </div>
        </UCard>
    </div>
</template>

<style lang="scss" scoped></style>
