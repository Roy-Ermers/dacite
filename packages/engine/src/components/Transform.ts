import Vector2 from "@/utils/Vector2";

export default class Transform {
    public constructor(public position: Vector2 = Vector2.zero, public rotation: number = 0) { }
}