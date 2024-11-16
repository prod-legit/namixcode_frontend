<script lang="ts" setup>
const {
    params: { utype },
} = useRoute();

const tabs = [
    {
        label: "Соискатель",
        slot: "user",
    },
    {
        label: "Работодатель",
        slot: "org",
    },
];
</script>

<template>
    <div class="__register flex flex-col md:flex-row-reverse">
        <div
            class="w-full md:w-1/2 flex items-center justify-center bg-flamingo-500 md:h-screen"
        >
            <img
                class="w-1/2 object-contain aspect-square max-w-[500px] rounded-full hover:scale-105 transition-transform duration-1000 select-none ease-in-out"
                src="/media/auth/1.png"
                alt="Графика"
            />
        </div>
        <div class="w-full md:w-1/2 p-12">
            <div class="w-full">
                <UTabs class="w-fit" :items="tabs">
                    <template #o="{ item }">
                        <div v-if="item.label === 'Соискатель'">
                            <UFormLogin :utype="utype" :title="item.label" />
                        </div>
                        <div v-else>
                            <UFormLogin :utype="utype" :title="item.label" />
                        </div>
                    </template>
                </UTabs>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
