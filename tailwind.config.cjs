/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "Inter", ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            ":not(pre) > code": {
              backgroundColor: theme("colors.neutral.200"),
              border: "1px solid",
              borderColor: theme("colors.zinc.300"),
              padding: "0.250rem 0.4rem",
              borderRadius: "0.250rem",
              fontWeight: "400",
            },
          },
        },
        invert: {
          css: {
            ":not(pre) > code": {
              backgroundColor: theme("colors.neutral.800"),
              borderColor: theme("colors.zinc.700"),
            },
          },
        },
      }),
      animation: {
        text: 'text 5s ease infinite',
      },
      keyframes: {
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
