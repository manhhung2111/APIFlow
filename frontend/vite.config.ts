import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
import {resolve} from "path";

export default defineConfig({
    base: './',
    plugins: [react(), viteTsconfigPaths()],
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