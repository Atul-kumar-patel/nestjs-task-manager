import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sandTan: '#e1b382',
        sandTanShadow: '#c89666',
        nightBlue: '#2d545e',
        nightBlueShadow: '#12343b',
      },
    },
  },
  plugins: [],
} satisfies Config;
