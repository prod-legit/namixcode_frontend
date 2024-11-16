<script lang="ts" setup>
const colorMode = useColorMode();

colorMode.preference = "light";
</script>

<template>
    <div class="__root">
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
