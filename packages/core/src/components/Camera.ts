export const ActiveCamera = Symbol.for("Active camera");
export default class Camera {
	constructor(public zoom = 1) {}
}
