import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/lovelink-mvp/",     // <- ИМЕТО на репото
});
