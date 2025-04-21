import type { Vector2 } from "../../utils";
import Collider from "./Collider";

export default class PlaneCollider extends Collider {
	constructor(
		public readonly start: Vector2,
		public readonly end: Vector2
	) {
		super();
	}
}
