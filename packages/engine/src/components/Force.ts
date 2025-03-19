import type Vector2 from "@dacite/engine/utils/Vector2.ts";
import { LinkedComponent } from "tick-knock";

type ForceType = "force" | "impulse";
export default class Force extends LinkedComponent {
    constructor(
        public readonly direction: Vector2,
        public readonly type: ForceType = "force"
    ) {
        super();
    }
}
