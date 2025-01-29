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
    //           '50': '#f3faf4',
    //           '100': '#e4f4e7',
    //           '200': '#cbe7d0',
    //           '300': '#a2d3ac',
    //           '400': '#71b77f',
    //           '500': '#4b965a',
    //           '600': '#3b7e49',
    //           '700': '#31643b',
    //           '800': '#2b5033',
    //           '900': '#25422b',
    //           DEFAULT: '#4b965a',
    //         },
    //       },
    //     }
    //   }
    // })
  ],
} satisfies Config;
