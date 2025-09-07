/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       colors: {
        // Normal
        primary: "#08CB00",
        secondary: "#253900",
        dark: "#000000",
        light: "#EEEEEE",

        // Deuteranopia
        deutPrimary: "#1F77B4",
        deutSecondary: "#7F7F7F",

        // Protanopia
        protPrimary: "#9467BD",
        protSecondary: "#8C564B",

        // Tritanopia
        tritPrimary: "#E6AB02",
        tritSecondary: "#7570B3",
      },
    },
  },
  plugins: [],
};
