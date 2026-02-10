/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FA8112",
        secondary: {
          v1: "#1c1c1c",
          v2: "#EDEDED",
        },
        accent: "#F9F9F9",
      },
      fontFamily: {
        poppins: ["Poppins-Black"],
        poppinsRegular: ["Poppins-Regular"],
      }
    },
  },
  plugins: [],
}