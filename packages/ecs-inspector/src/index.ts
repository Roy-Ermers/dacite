import Scope from "@dacite/ecs";
import appTemplate from "./App.vue";
import { createApp, defineAsyncComponent } from "vue";
import "./assets/style.css";
import { ScopeInjectionKey } from "./utils/ScopeInjectionKey";

const components = import.meta.glob("./components/**/*.vue", { import: "default" });

interface InspectorOptions {
	scope: Scope;
	element: HTMLElement;
}
export default function createInspector(options: InspectorOptions) {
	const app = createApp(appTemplate);
	app.provide(ScopeInjectionKey, options.scope);

	const container = document.createElement("aside");
	container.dataset.theme = "dark";
	container.id = "inspector";
	options.element.appendChild(container);

	for (const [name, component] of Object.entries(components)) {
		const componentName = parseComponentName(name);
		console.log(componentName);
		app.component(componentName, defineAsyncComponent(component as any));
	}

	app.mount(container);
}

function parseComponentName(path: string) {
	// remove initial dot and `components`, then split on /
	const parts = path.split("/").slice(2);

	return 'scout-' + parts.map(x => x.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase().trim()).join("-").replace(/\.vue$/, '');
}
