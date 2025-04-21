import { ComponentSet } from "@dacite/ecs";
import type Vector2 from "../utils/Vector2.ts";

type ForceType = "force" | "impulse";
export default class Force {
	readonly type: ForceType = "force";
	constructor(
		public readonly direction: Vector2,
		public readonly point?: Vector2
	) {}
}

export class Impulse extends Force {
	override readonly type = "impulse";
}

const ForceComponentSet = ComponentSet.create(Force);
export { ForceComponentSet };
