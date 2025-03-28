import type { Type } from "./Types";

export default function getComponentName(variable: unknown) {
	if (!variable) return "Unknown";
	if (typeof variable === "symbol") {
		return variable.description;
	}

	if (typeof variable === "function") {
		return variable.name;
	}

	return (variable as Type).constructor.name;
}
