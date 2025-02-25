import Collider from "@scout/engine/components/colliders/Collider.ts";

export default class BoxCollider extends Collider {
    get lookupRadius(): number {
        return Math.max(this.width, this.height) * 2;
    }

    constructor(public readonly width: number, public readonly height: number) {
        super();
    }
}