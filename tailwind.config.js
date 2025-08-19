/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./constants/**/*.{js,ts,jsx,tsx}",
      "./hooks/**/*.{js,ts,jsx,tsx}",
      "./scripts/**/*.{js,ts,jsx,tsx}",
      "./global.css"
    ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
            fontFamily: {
        heading: ["Lato_700Bold", "Lato_400Regular"],
        body: ["Quicksand_400Regular", "Quicksand_500Medium"],
      },
    },
  },
  plugins: [],
}