import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import packageJson from "./package.json";

function formatPath(path: string) {
	if (path === ".") {
		return "index";
	}

	return path.slice(2);
}

export default defineConfig({
	resolve: {
		conditions: ["source", "module", "import"]
	},
	build: {
		rollupOptions: {
			external: ["@dacite/ecs", "pixi.js"]
		},
		lib: {
			entry: Object.fromEntries(
				Object.entries(packageJson.exports).map(([path, { source }]) => [
					formatPath(path),
					source
				])
			),
			formats: ["es"]
		}
	},
	plugins: [
		dts({
			rollupTypes: true,
			entryRoot: "src"
		})
	]
});
