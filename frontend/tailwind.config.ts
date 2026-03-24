import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#f7f6ff",
          100: "#ede9ff",
          200: "#dcd3ff",
          300: "#c2acff",
          400: "#a07bff",
          500: "#7c48f5",
          600: "#622dd8",
          700: "#4f25ab",
          800: "#3f2188",
          900: "#331d6e"
        },
        sand: "#f7f1e8",
        night: "#0f1024"
      }
    }
  },
  plugins: []
};

export default config;
