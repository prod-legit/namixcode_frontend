<script lang="ts" setup>
const {
    params: { utype },
} = useRoute();
</script>

<template>
    <div class="__login">
        <div class="p-4">
            <UAlert title="Login page" description="To be implemented"></UAlert>
        </div>
        <UButton :to="`/${utype}/register`">Зарегистрироваться</UButton>
    </div>
</template>

<style lang="scss" scoped></style>
