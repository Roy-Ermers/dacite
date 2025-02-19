import type Vector2 from "@/utils/Vector2";
import { LinkedComponent } from "tick-knock";

export default class Force extends LinkedComponent {
    constructor(public readonly direction: Vector2) {
        super();
    }
}