import type { Config } from "tailwindcss";

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                flamingo: {
                    "50": "#fef3ee",
                    "100": "#fde4d7",
                    "200": "#fbc6ad",
                    "300": "#f89e79",
                    "400": "#f46b43",
                    "500": "#f25430",
                    "600": "#e22d14",
                    "700": "#bb1e13",
                    "800": "#951a17",
                    "900": "#781916",
                    "950": "#41090a",
                },
                izumrud: {
                    "50": "#effefb",
                    "100": "#c9fef6",
                    "200": "#94fbee",
                    "300": "#56f2e4",
                    "400": "#23ded2",
                    "500": "#0bc1b9",
                    "600": "#059c98",
                    "700": "#097c7a",
                    "800": "#0d6666",
                    "900": "#105151",
                    "950": "#022f31",
                },
                carrot: {
                    "50": "#fff8ed",
                    "100": "#fff0d4",
                    "200": "#ffdda8",
                    "300": "#ffc471",
                    "400": "#ff9929",
                    "500": "#fe8311",
                    "600": "#ef6807",
                    "700": "#c64d08",
                    "800": "#9d3d0f",
                    "900": "#7e3410",
                    "950": "#441806",
                },
            },
        },
    },
};
