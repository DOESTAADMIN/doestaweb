import type { Config } from "tailwindcss";
import { PluginCreator } from "tailwindcss/types/config";

const scrollbarHidePlugin: PluginCreator = ({ addUtilities }) => {
    const newUtilities = {
        ".scrollbar-hide": {
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
            "&::-webkit-scrollbar": {
                display: "none"
            }
        }
    };
    addUtilities(newUtilities);
};

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                // Legacy colors restored for compatibility
                black: {
                    DEFAULT: "#24292E",
                    odd: "#14191E"
                },
                white: {
                    DEFAULT: "#F8F8F8",
                    extra: "#fff"
                },
                gold: { DEFAULT: "#997B48" },
                silver: { DEFAULT: "#C0C0C0", dark: "#A0A0A0" },
                orange: { light: "#FFA500", DEFAULT: "#d97706", dark: "#FF8C00" },
                red: { light: "#FF4500", DEFAULT: "#B22222" },
                green: { light: "#32CD32", DEFAULT: "#43513D" },
                warning: { light: "#fde047", DEFAULT: "#facc15", dark: "#eab308" },
                danger: { light: "#f87171", DEFAULT: "#ef4444", dark: "#dc2626" },
                success: { light: "#4ade80", DEFAULT: "#22c55e", dark: "#16a34a" },
                freeze: { light: "#d8b4fe", DEFAULT: "#9333ea", dark: "#581c87" },
                mainTextColor: { light: "#00000090", DEFAULT: "#4B5675", dark: "#252F4A" },
                mainIconColor: { DEFAULT: "#99A1B7" },

                // Modern Palette (The user requested "Better Design")
                sidebar: {
                    DEFAULT: "#0f172a", // slate-900
                    hover: "#1e293b",   // slate-800
                    active: "#334155",  // slate-700
                    text: "#94a3b8",    // slate-400
                    textActive: "#f8fafc" // slate-50
                },
                primary: {
                    light: "#60a5fa",
                    DEFAULT: "#3b82f6", // Updated to standard blue, was #104E8B
                    dark: "#2563eb",
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                }
            },
            boxShadow: {
                'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            }
        }
    },
    plugins: [scrollbarHidePlugin]
};

export default config;
