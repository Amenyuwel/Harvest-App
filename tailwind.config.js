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
      colors: {
        background: "#ECEBE2", // Background
        button: "#4CAF50", // Button
        error: "#E53935", // Error
        back: "#9E9E9E", // Back
        card: "#ffffff", // Card background
        black: "#111111" // Text color
      },
    },
  },
  plugins: [],
}