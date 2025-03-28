import { ComponentSet, ComponentSymbols } from "@dacite/ecs";
import type Vector2 from "../utils/Vector2.ts";

type ForceType = "force" | "impulse";
export default class Force {
	constructor(
		public readonly direction: Vector2,
		public readonly type: ForceType = "force"
	) {}
}

// really fuggly way to get the component type
ComponentSymbols.componentType;

const ForceComponentSet = ComponentSet.create(Force);
export { ForceComponentSet };
