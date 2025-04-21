import { AnimatedSprite, Container, Sprite } from "pixi.js";

export default class Renderable<T extends Container = Container> {
	public container: T;

	private _texture: T | null = null;

	public get texture() {
		return this._texture ?? this.container;
	}

	public dirty = false;

	public setTexture(value: T) {
		if (!(value instanceof Container)) {
			throw new Error("Invalid texture type");
		}
		if (value === this._texture) return;
		this._texture = value;

		this.dirty = true;

		if (this._texture instanceof Sprite) {
			this._texture.anchor.set(0.5);
		}

		if (this._texture instanceof AnimatedSprite) this._texture.play();
	}

	public constructor(
		texture: T,
		public zIndex: number | null = null
	) {
		this.container = texture;
		this.setTexture(texture);
	}
}
