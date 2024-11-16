<template>
    <div
        class="error-page flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
        <h1 class="text-4xl font-bold mb-4">Ошибка</h1>
        <p class="text-lg text-gray-700 mb-6">
            Извините, произошла ошибка при обработке вашего запроса.
        </p>
        <UButton size="lg" to="/">Вернуться на главную</UButton>
    </div>
</template>

<script setup>
definePageMeta({
    layout: "default",
    middleware: "auth",
});
</script>
