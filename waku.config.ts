import { defineConfig } from 'waku/config';
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tsconfigPaths(), tailwindcss()],
  },
});
