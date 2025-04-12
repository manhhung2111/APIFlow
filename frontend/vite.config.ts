import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import {resolve} from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: './',
    plugins: [react(), tsconfigPaths()],
    server: {
        port: 3000,
    },
    preview: {
        port: 3000,
    },
    resolve: {
        alias: {
            "@styles": resolve(__dirname, "./src/styles"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["legacy-js-api"],
            },
        },
    },
    optimizeDeps: {exclude: ['fsevents']},
    build: {
        rollupOptions: {
            external: ['fs/promises'],
            output: {
                experimentalMinChunkSize: 3500,
            },
        },
    },
});