import Vector2 from "../utils/Vector2.ts";

export default class Transform {
	public constructor(
		public position: Vector2 = Vector2.zero,
		public rotation = 0
	) {}
}
