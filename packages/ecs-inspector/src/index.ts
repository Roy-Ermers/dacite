import type { Scope } from "@dacite/ecs";
import { createApp, defineAsyncComponent } from "vue";
import appTemplate from "./App.vue";
import "./assets/style.css";
import { ScopeInjectionKey } from "./utils/ScopeInjectionKey";

const components = import.meta.glob("./components/**/*.vue", {
	import: "default"
});

interface InspectorOptions {
	scope?: Scope;
	element?: HTMLElement | null;
}
export default function createInspector(options?: InspectorOptions) {
	const app = createApp(appTemplate);
	// @ts-expect-error
	const scope = options?.scope ?? globalThis.__ECS__;

	if (!scope) throw new Error("Scope not provided");

	app.provide(ScopeInjectionKey, scope);

	const container = document.createElement("aside");
	container.dataset.theme = "dark";
	container.id = "inspector";

	const element = options?.element ?? document.body;
	element.appendChild(container);

	for (const [name, component] of Object.entries(components)) {
		const componentName = parseComponentName(name);
		app.component(componentName, defineAsyncComponent(component as any));
	}

	app.mount(container);
}

function parseComponentName(path: string) {
	// remove initial dot and `components`, then split on /
	const parts = path.split("/").slice(2);

	const name = parts
		.map(x =>
			x
				.replace(/([a-z])([A-Z])/g, "$1-$2")
				.toLowerCase()
				.trim()
		)
		.join("-");

	return `dacite-${name}`.replace(/\.vue$/, "");
}
