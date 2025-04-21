import Collider from "./Collider.ts";

export default class CircleCollider extends Collider {
	constructor(public readonly radius: number) {
		super();
	}
}
