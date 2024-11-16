<script lang="ts" setup>
const { seo } = useAppConfig();

useSeoMeta({
    ogImage: seo.image,
    twitterImage: seo.image,
    twitterCard: "summary",
});

useHead({
    link: [
        {
            rel: "icon",
            type: "image/svg",
            href: "/favicon.svg",
        },
    ],
});
</script>

<template>
    <div class="__root"></div>
</template>

<style lang="scss" scoped>
.__root {
}
</style>
