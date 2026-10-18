import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "site",
  base: "/design-tokens/",
  plugins: [tailwindcss()],
  build: { outDir: "dist", emptyOutDir: true },
});
