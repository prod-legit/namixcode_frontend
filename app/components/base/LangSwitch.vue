<script setup lang="ts">
const { locale, setLocale } = useI18n();
</script>

<template>
    <div>
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button variant="outline">
                    <Icon v-show="locale === 'en'" name="flagpack:gb-nir" />
                    <Icon v-show="locale === 'ru'" name="flagpack:ru" />
                    <span class="sr-only">{{ $t("changelang") }}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem @click="setLocale('en')">
                    English
                </DropdownMenuItem>
                <DropdownMenuItem @click="setLocale('ru')">
                    Русский
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>
