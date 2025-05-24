/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
      "./App.{js,jsx,ts,tsx}",
      "./app/**/*.{js,jsx,ts,tsx}", // include this for routing folders
    ],
    darkMode: 'class', // Use class strategy instead of media
    presets: [require("nativewind/preset")],
    theme: {
      extend: {},
    },
    plugins: [],
}  