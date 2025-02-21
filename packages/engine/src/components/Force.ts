import type Vector2 from "@/utils/Vector2";
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