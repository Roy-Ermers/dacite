import Collider from "@/components/colliders/Collider";

export default class CircleCollider extends Collider {
    get lookupRadius(): number {
        return this.radius * 2;
    }

    constructor(public readonly radius: number) {
        super();
    }
}