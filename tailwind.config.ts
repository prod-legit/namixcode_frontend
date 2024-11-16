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
            },
        },
    },
};
