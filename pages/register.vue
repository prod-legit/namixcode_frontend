<script lang="ts" setup>
const {
    params: { utype },
} = useRoute();

const tabs = [
    {
        label: "Соискатель",
        key: "user",
    },
    {
        label: "Работодатель",
        key: "org",
    },
];

const userState = reactive({
    email: "",
    fullName: "",
    birthDate: "",
    gender: "",
    profession: "",
    experience: "",
    agree: false,
});

const userStateValid = computed(() => {
    return (
        userState.email.length > 0 &&
        userState.fullName.length > 0 &&
        userState.birthDate.length > 0 &&
        userState.gender.length > 0 &&
        userState.profession.length > 0 &&
        userState.experience.length > 0 &&
        userState.agree
    );
});

const orgState = reactive({
    email: "",
    company: "",
    sphere: "",
    year: "",
    location: "",
    agree: false,
});

const orgStateValid = computed(() => {
    return (
        orgState.email.length > 0 &&
        orgState.company.length > 0 &&
        orgState.sphere.length > 0 &&
        orgState.year &&
        orgState.location.length > 0 &&
        orgState.agree
    );
});
const flow = reactive({
    step: 1,
    picked: "",
});

const flowStepTwo = () => {
	if ()
};
</script>

<template>
    <div class="__register flex flex-col md:flex-row-reverse">
        <!-- Графика -->
        <div
            class="w-full md:w-1/2 flex items-center justify-center bg-flamingo-500 md:h-screen"
        >
            <img
                class="w-1/2 object-contain aspect-square max-w-[500px] rounded-full hover:scale-105 transition-transform duration-1000 select-none ease-in-out"
                src="/media/auth/1.png"
                alt="Графика"
            />
        </div>
        <!-- Функционально -->
        <div class="w-full md:w-1/2 p-12">
            <div class="w-full">
                <UTabs :items="tabs" v-if="flow.step === 1">
                    <template #item="{ item }">
                        <div class="py-4 space-y-6">
                            <!-- Заголовок -->
                            <div class="space-y-3">
                                <h1 class="text-3xl font-bold">Регистрация</h1>
                                <p>
                                    Уже есть аккаунт?
                                    <UButton
                                        variant="link"
                                        to="/login"
                                        color="blue"
                                    >
                                        Войти
                                    </UButton>
                                </p>
                            </div>
                            <!-- Форма -->
                            <div class="space-y-3" v-if="item.key === 'org'">
                                <UFormGroup label="Email">
                                    <UInput
                                        type="email"
                                        placeholder="abobus@example.com"
                                        v-model="orgState.email"
                                        size="lg"
                                    />
                                </UFormGroup>
                                <UFormGroup label="Компания">
                                    <UInput
                                        type="text"
                                        placeholder='ООО "Наймикс"'
                                        v-model="orgState.company"
                                        size="lg"
                                    />
                                </UFormGroup>
                                <UFormGroup label="Сфера">
                                    <UInputMenu
                                        :options="[
                                            'IT',
                                            'Финансы',
                                            'Маркетинг',
                                            'Образование',
                                            'Здравоохранение',
                                            'Транспорт',
                                            'Строительство',
                                            'Производство',
                                            'Розничная торговля',
                                            'Гостиничный бизнес',
                                        ]"
                                        placeholder="Будущее рекруттинга"
                                        v-model="orgState.sphere"
                                        size="lg"
                                    >
                                    </UInputMenu>
                                </UFormGroup>
                                <div class="flex gap-3">
                                    <UFormGroup
                                        label="Год основания"
                                        class="w-full"
                                    >
                                        <UInput
                                            type="number"
                                            placeholder="2018"
                                            v-model="orgState.year"
                                            size="lg"
                                        />
                                    </UFormGroup>
                                    <UFormGroup class="w-full" label="Локация">
                                        <UInputMenu
                                            :options="[
                                                'Москва',
                                                'Казань',
                                                'Новосибирск',
                                                'Екатеринбург',
                                                'Самара',
                                                'Ростов-на-Дону',
                                                'Краснодар',
                                                'Воронеж',
                                                '52',
                                            ]"
                                            placeholder="Москва"
                                            v-model="orgState.location"
                                            size="lg"
                                        />
                                    </UFormGroup>
                                </div>
                            </div>
                            <div class="space-y-3" v-if="item.key === 'user'">
                                <UFormGroup label="Email">
                                    <UInput
                                        type="email"
                                        placeholder="abobus@example.com"
                                        v-model="userState.email"
                                        size="lg"
                                    />
                                </UFormGroup>
                                <UFormGroup label="ФИО">
                                    <UInput
                                        type="text"
                                        placeholder="Иванов Иван Иванович"
                                        v-model="userState.fullName"
                                        size="lg"
                                    />
                                </UFormGroup>
                                <div class="flex gap-3">
                                    <UFormGroup
                                        label="Дата рождения"
                                        class="w-full"
                                    >
                                        <UInput
                                            type="date"
                                            v-model="userState.birthDate"
                                            size="lg"
                                        />
                                    </UFormGroup>
                                    <UFormGroup label="Пол" class="w-full">
                                        <UInputMenu
                                            :options="['Мужской', 'Женский']"
                                            placeholder="Выберите пол"
                                            v-model="userState.gender"
                                            size="lg"
                                        />
                                    </UFormGroup>
                                </div>
                                <div class="flex gap-3">
                                    <UFormGroup
                                        label="Профессия"
                                        class="w-full"
                                    >
                                        <UInput
                                            type="text"
                                            placeholder="Программист"
                                            v-model="userState.profession"
                                            size="lg"
                                        />
                                    </UFormGroup>
                                    <UFormGroup
                                        label="Опыт работы"
                                        class="w-full"
                                    >
                                        <UInput
                                            type="text"
                                            placeholder="5 лет"
                                            v-model="userState.experience"
                                            size="lg"
                                        />
                                    </UFormGroup>
                                </div>
                            </div>

                            <!-- Кнопка -->
                            <div class="space-y-3">
                                <div class="flex items-center gap-2">
                                    <UCheckbox
                                        v-if="item.key === 'user'"
                                        v-model="userState.agree"
                                    />
                                    <UCheckbox
                                        v-else-if="item.key === 'org'"
                                        v-model="orgState.agree"
                                    />
                                    <p>
                                        Я согласен
                                        <UButton
                                            variant="link"
                                            to="/terms"
                                            color="blue"
                                        >
                                            на обработку персональных данных и с
                                            политикой конфиденциальности
                                        </UButton>
                                    </p>
                                </div>
                                <UButton
                                    class="w-full"
                                    :ui="{
                                        inline: 'justify-center',
                                        rounded: 'rounded-full',
                                    }"
                                    size="lg"
                                    :disabled="
                                        (!orgStateValid &&
                                            item.key === 'org') ||
                                        (!userStateValid && item.key === 'user')
                                    "
                                    @click="flowStepTwo(item.key)"
                                >
                                    Зарегистрироваться
                                </UButton>
                            </div>
                        </div>
                    </template>
                </UTabs>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
