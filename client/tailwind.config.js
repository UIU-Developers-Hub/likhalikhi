/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode
  theme: {
    extend: {
      colors: {
        cusDarkBG: "#1B1B25", //this is the custom color for dark background
        cusLightDarkBG: "#252436", //this is the custom color for light dark background
        cusPrimaryColor: "#A57982", // this is the custom color for primary color
        cusSecondaryColor: "#B98EA7", // this is the custom color for secondary color
        cusSecondaryLightColor: "#F0D3F7", // this is the custom color for secondary light color
        cusLightBG: "#F8E8F1", // this is the custom color for light background
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
