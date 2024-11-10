const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        lime: {
          50: "#f6ffe4",
          100: "#e9ffc4",
          200: "#d3ff90",
          300: "#b3ff50",
          400: "#88ff01",
          500: "#74e600",
          600: "#58b800",
          700: "#428b00",
          800: "#376d07",
          900: "#305c0b",
          950: "#153400",
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
