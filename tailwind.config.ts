import type {Config} from "tailwindcss";

// Design tokens live here so both apps share one consistent look.
const config: Config = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {DEFAULT: "#2563eb", dark: "#1e40af", light: "#dbeafe"},
            },
        },
    },
    plugins: [],
};
export default config;
