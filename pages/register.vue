<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import type { User } from "~/types/User";
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

const flowStepTwo = (type: "user" | "org") => {
    if (type === "user") {
        flow.picked = "user";
    } else {
        flow.picked = "org";
    }
    flow.step = 2;
};

const descriptionState = reactive({
    avatar: "",
    description: "",
    skills: "",
});

const descriptionStateValid = computed(() => {
    return (
        (descriptionState.description.length > 0 &&
            flow.picked === "org" &&
            descriptionState.avatar.length > 0) ||
        (flow.picked == "user" && descriptionState.skills.length > 0)
    );
});

const flowStepThree = () => {
    flow.step = 3;
};

const passwordState = reactive({
    password: "",
    confirmPassword: "",
});

const passwordStateValid = computed(() => {
    return (
        passwordState.password === passwordState.confirmPassword &&
        passwordState.password.length > 0
    );
});

const toast = useToast();

const route = useRoute();
const router = useRouter();

const registerSubmit = async () => {
    try {
        const session = useLocalStorage<{
            token: string | null;
            user: User | null;
        }>("session", () => ({
            token: null,
            user: null,
        }));

        if (flow.picked === "user") {
            const registrationData = {
                email: userState.email,
                password: passwordState.password,
                name: userState.fullName,
                phone: "", // Add phone field if available
                sex: userState.gender === "Мужской" ? "male" : "female",
                birthdate: userState.birthDate,
                experience: parseInt(userState.experience),
                professions: [userState.profession],
                interests: descriptionState.skills.split(","), // Assuming skills are comma-separated
            };

            const { token } = await $api<{
                token: string;
                type: string;
            }>(`/api/user/register`, {
                method: "POST",
                body: registrationData,
            });
            session.value.token = token;
        } else if (flow.picked === "org") {
            const registrationData = {
                email: orgState.email,
                password: passwordState.password,
                name: orgState.company,
                description: descriptionState.description,
                location: orgState.location,
                logo: descriptionState.avatar,
                foundation_year: parseInt(orgState.year),
                scope: orgState.sphere,
            };

            const { token } = await $api<{
                token: string;
                type: string;
            }>(`/api/org/register`, {
                method: "POST",
                body: registrationData,
            });
            session.value.token = token;
        }
        toast.add({
            color: "green",
            title: "Успешная регистрация",
            description: "Поздравляем, ты успешно зарегистрирован(а)!",
            icon: "line-md:briefcase-check-twotone",
        });

        router.push((route.query.flowDest as string | undefined) ?? "/");
    } catch (err) {
        toast.add({
            color: "flamingo",
            title: "Ошибка регистрации",
            description: (err as Error).message,
            icon: "line-md:alert-twotone",
        });
    }
};
const { $api } = useNuxtApp();

const pickAvatar = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                descriptionState.avatar = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
};
</script>

<template>
    <div class="__register flex flex-col md:flex-row-reverse">
        <!-- Графика -->
        <div
            class="w-full md:w-1/2 flex items-center justify-center bg-flamingo-500 md:h-screen rounded-bl-2xl rounded-br-2xl md:rounded-br-none md:rounded-tl-2xl"
        >
            <img
                class="w-1/2 object-contain aspect-square max-w-[500px] rounded-full hover:scale-105 transition-transform duration-1000 select-none ease-in-out"
                :src="`/media/auth/${flow.step}.png`"
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
                                        :to="{
                                            path: '/login',
                                            query: route.query,
                                        }"
                                        color="blue"
                                    >
                                        Войти
                                    </UButton>
                                </p>
                            </div>
                            <!-- Форма -->
                            <div class="space-y-3" v-if="item.key === 'org'">
                                <UFormGroup label="Почта">
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
                                <UFormGroup label="Почта">
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
                                        (item.key === 'org' &&
                                            !orgStateValid) ||
                                        (item.key === 'user' && !userStateValid)
                                    "
                                    @click="flowStepTwo(item.key)"
                                >
                                    Зарегистрироваться
                                </UButton>
                            </div>
                        </div>
                    </template>
                </UTabs>
                <div v-if="flow.step === 2">
                    <div class="py-4 space-y-6">
                        <h1 class="text-3xl font-bold">Описание</h1>
                        <div class="space-y-3" v-if="flow.picked === 'org'">
                            <div class="flex items-center gap-4">
                                <UButton
                                    v-if="!descriptionState.avatar"
                                    icon="mdi:plus"
                                    size="xl"
                                    @click="pickAvatar"
                                />
                                <img
                                    v-else
                                    class="rounded-lg aspect-[1/1] object-cover w-24"
                                    :src="descriptionState.avatar"
                                    alt="Аватарка"
                                />
                                <h2 class="text-2xl font-semibold">
                                    {{ orgState.company }}
                                </h2>
                            </div>
                            <UFormGroup label="Описание компании">
                                <UTextarea
                                    placeholder="Расскажите о вашей компании"
                                    v-model="descriptionState.description"
                                    size="lg"
                                />
                            </UFormGroup>
                        </div>
                        <div class="space-y-3" v-if="flow.picked === 'user'">
                            <UFormGroup
                                label="Профессиональные навыки"
                                help="Через запятую"
                            >
                                <UTextarea
                                    placeholder="Опишите ваши навыки"
                                    v-model="descriptionState.skills"
                                    size="lg"
                                />
                            </UFormGroup>
                            <UFormGroup label="Увлечения">
                                <UTextarea
                                    placeholder="Расскажите о себе"
                                    v-model="descriptionState.description"
                                    size="lg"
                                />
                            </UFormGroup>
                        </div>
                        <UButton
                            class="w-full"
                            :ui="{
                                inline: 'justify-center',
                                rounded: 'rounded-full',
                            }"
                            size="lg"
                            :disabled="!descriptionStateValid"
                            @click="flowStepThree"
                        >
                            Далее
                        </UButton>
                    </div>
                </div>
                <div v-if="flow.step === 3">
                    <div class="py-4 space-y-6">
                        <h1 class="text-3xl font-bold">Подтверждение пароля</h1>
                        <div class="space-y-3">
                            <UFormGroup label="Пароль">
                                <UInput
                                    type="password"
                                    placeholder="Введите пароль"
                                    v-model="passwordState.password"
                                    size="lg"
                                />
                            </UFormGroup>
                            <UFormGroup label="Подтвердите пароль">
                                <UInput
                                    type="password"
                                    placeholder="Подтвердите пароль"
                                    v-model="passwordState.confirmPassword"
                                    size="lg"
                                />
                            </UFormGroup>
                        </div>
                        <UButton
                            class="w-full"
                            :ui="{
                                inline: 'justify-center',
                                rounded: 'rounded-full',
                            }"
                            size="lg"
                            :disabled="!passwordStateValid"
                            @click="registerSubmit"
                        >
                            Подтвердить
                        </UButton>
                    </div>
                </div>
                <div class="flex gap-3 items-center justify-center">
                    <div
                        class="rounded-full h-2 w-24 bg-gray-400"
                        :style="{
                            opacity: flow.step >= i ? 1 : 0.5,
                        }"
                        v-for="i in 3"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
