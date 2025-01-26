import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui()
    // nextui({
    //   themes: {
    //     light: {
    //       colors: {
    //         primary: {
    //           '50': '#fef3f2',
    //           '100': '#fde7e6',
    //           '200': '#fad1d1',
    //           '300': '#f6acab',
    //           '400': '#f07c7e',
    //           '500': '#e64d53',
    //           '600': '#d12d3b',
    //           '700': '#b82132',
    //           '800': '#941d2e',
    //           '900': '#7f1c2e',
    //           DEFAULT: '#B82132',
    //         },
    //       },
    //     }
    //   }
    // })
  ],
} satisfies Config;
