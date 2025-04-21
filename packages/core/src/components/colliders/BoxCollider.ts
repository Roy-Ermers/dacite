import Collider from "./Collider.ts";

export default class BoxCollider extends Collider {
	constructor(
		public readonly width: number,
		public readonly height: number
	) {
		super();
	}
}
