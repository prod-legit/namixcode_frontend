<script lang="ts" setup>
import {
    useWindowScroll,
    useBreakpoints,
    breakpointsTailwind,
} from "@vueuse/core";

const { y } = useWindowScroll();

const width = ref(100);
const displace = ref(0);

const update = () => {
    displace.value = y.value / 20;
    width.value = displace.value + Math.floor(Math.random() * 30);
};

const intervalSet = ref();

onMounted(() => {
    if (!intervalSet.value) {
        intervalSet.value = setInterval(update, 100);
    }
});

onUnmounted(() => {
    if (intervalSet.value) clearInterval(intervalSet.value);
});

const spread = 0.5;

const breakpoints = useBreakpoints(breakpointsTailwind);

const size = computed(() => {
    if (breakpoints.lg.value) return 96;
    if (breakpoints.md.value) return 72;
    if (breakpoints.sm.value) return 60;
    return 42;
});
</script>

<template>
    <div class="__home">
        <!-- Hero -->
        <div
            style="height: calc(100vh - var(--header-height))"
            class="flex flex-col items-center justify-center"
        >
            <!-- Blobs -->
            <div class="fixed inset-0 blur-3xl -z-10">
                <!-- Top left - primary -->
                <div
                    class="bg-primary aspect-[1/1] absolute left-1/2 top-1/2 rounded-full transition-all duration-300 ease-in-out"
                    :style="{
                        width: `${400 + width}px`,
                        transform: `translate(-${72 + displace * spread}%, -${
                            64 + displace * spread
                        }%)`,
                    }"
                />
                <!-- Top right - carrot -->
                <div
                    class="bg-carrot-500 aspect-[1/1] absolute left-1/2 top-1/2 rounded-full transition-all duration-300 ease-in-out"
                    :style="{
                        width: `${400 + width}px`,
                        transform: `translate(${4 + displace * spread}%, ${
                            -112 - displace * spread
                        }%)`,
                    }"
                />
                <!-- Bottom left - gray -->
                <div
                    class="bg-black opacity-80 aspect-[1/1] absolute left-1/2 top-1/2 rounded-full transition-all duration-300 ease-in-out"
                    :style="{
                        width: `${400 + width}px`,
                        transform: `translate(-${72 + displace * spread}%, ${
                            32 + displace * spread
                        }%)`,
                    }"
                />
                <!-- Bottom right - izumrud -->
                <div
                    class="bg-izumrud-700 aspect-[1/1] absolute left-1/2 top-1/2 rounded-full transition-all duration-300 ease-in-out"
                    :style="{
                        width: `${400 + width}px`,
                        transform: `translate(${4 + displace * spread}%, ${
                            -16 + displace * spread
                        }%)`,
                    }"
                />
            </div>
            <!-- Hero block -->
            <h1
                class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-nowrap"
            >
                <p
                    class="overflow-hidden block text-white"
                    :style="{
                        height: `${Math.min(Math.max(300 - y, 0), size * 2)}px`,
                    }"
                >
                    Спросите звёзды
                </p>
                <p
                    class="overflow-hidden flex items-end"
                    :style="{
                        height: `${Math.min(
                            Math.max(y - 300 + size, 0),
                            size * 2
                        )}px`,
                    }"
                >
                    Спросите звёзды
                </p>
            </h1>
            <UButton to="/register" size="lg"> Попробовать </UButton>
        </div>
        <div class="h-screen border-t border-t-black"></div>
        <div class="h-screen border-t border-t-black"></div>
        <div class="h-screen border-t border-t-black"></div>
        <div class="h-screen border-t border-t-black"></div>
    </div>
</template>

<style lang="scss" scoped></style>
