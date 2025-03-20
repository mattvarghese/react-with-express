import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "",
  server: {
    port: 5000,
    proxy: {
      "/todolist": "http://localhost:3000", // Adjust for your backend URL
    },
  },
  plugins: [react(), tailwindcss()],
});
