// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/rotatingx/", // Replace 'rotating-x' with your repository name
  plugins: [react()],
});
