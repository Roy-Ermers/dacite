import ComponentSet from "../components/ComponentSet";
import Entity from "../entities/Entity";
import type { Type } from "./Types";

declare global {
	interface CustomFormatter {
		header: (obj: unknown) => JSONML | null;
		hasBody: (obj: unknown) => boolean;
		body: (obj: unknown) => JSONML | null;
	}

	interface JSONMLNode {
		tagName: string;
		attributes: { [key: string]: string };
		children: Array<JSONML>;
	}

	type JSONML =
		| [string, Record<string, unknown>, ...JSONML[]]
		| JSONMLNode
		| string;

	interface Window {
		devtoolsFormatters: CustomFormatter[];
	}
}

class ComponentSetFormatter implements CustomFormatter {
	header(variable: unknown) {
		if (!(variable instanceof ComponentSet)) return null;

		return [
			"div",
			{},
			`${variable.constructor.name} (${variable.toArray().length})`
		] as JSONML;
	}

	hasBody(variable: unknown) {
		return variable instanceof ComponentSet;
	}

	body(variable: unknown) {
		if (!(variable instanceof ComponentSet)) {
			return null;
		}
		const items = variable.toArray();
		return [
			"div",
			{},
			...items.map(
				item =>
					[
						"div",
						{ style: "padding-inline-start: 1rem;" },
						["object", { object: item }]
					] as JSONML
			)
		] as JSONML;
	}
}

function getTypeName(variable: unknown) {
	if (typeof variable === "symbol") {
		return variable.description;
	}

	if (typeof variable === "function") {
		return variable.name;
	}

	return (variable as Type).constructor.name;
}

class EntityFormatter implements CustomFormatter {
	header(variable: unknown) {
		if (!(variable instanceof Entity)) return null;

		return [
			"div",
			{
				style: "color: yellow"
			},
			`${variable.name} #${variable.id}`
		] as JSONML;
	}

	hasBody(variable: unknown) {
		return variable instanceof Entity && variable.hasAny();
	}

	body(variable: unknown) {
		if (!(variable instanceof Entity)) {
			return null;
		}

		const result = [];
		for (const [type, set] of variable.scope.components) {
			if (!set.has(variable.id)) {
				continue;
			}

			result.push([
				"tr",
				{},
				[
					"td",
					{ style: "color: pink; vertical-align: top" },
					getTypeName(type)
				],
				["td", {}, ["object", { object: set.get(variable.id) }]]
			]);
		}

		return ["table", {}, ...result] as JSONML;
	}
}

window.devtoolsFormatters = [
	new ComponentSetFormatter(),
	new EntityFormatter()
];
