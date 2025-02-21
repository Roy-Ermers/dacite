import type Vector2 from "@/utils/Vector2";
import { LinkedComponent } from "tick-knock";

export default class CollisionResult extends LinkedComponent {
    constructor(
        public readonly normal: Vector2,
        public readonly penetration: number
    ) {
        super();
    }
}