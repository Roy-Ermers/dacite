import { System } from "@dacite/ecs";

export default class InputSystem extends System {
	private static _instance: InputSystem;

	public static get instance() {
		return InputSystem._instance;
	}

	override get priority() {
		return -1;
	}

	private pressedKeys: Set<string> = new Set();
	private currentFrame: Set<string> = new Set();
	public wheel = 0;

	constructor(target: EventTarget = window) {
		super();

		InputSystem._instance = this;
		target.addEventListener("keydown", e =>
			this.handleKeyDown(e as KeyboardEvent)
		);
		target.addEventListener("keyup", e => this.handleKeyUp(e as KeyboardEvent));
		target.addEventListener("blur", () => this.clearAll());
		target.addEventListener("wheel", e => {
			this.wheel += (e as WheelEvent).deltaY * -0.01;
		});
	}

	clearAll() {
		this.pressedKeys.clear();
		this.currentFrame.clear();
	}

	private handleKeyDown(event: KeyboardEvent) {
		this.addKey(event.key.toLowerCase());

		if (event.ctrlKey) this.addKey("ctrl");

		if (event.shiftKey) this.addKey("shift");

		if (event.metaKey) this.addKey("meta");

		if (event.altKey) this.addKey("alt");
	}

	private handleKeyUp(event: KeyboardEvent) {
		this.pressedKeys.delete(event.key.toLowerCase());

		if (!event.ctrlKey) this.pressedKeys.delete("ctrl");

		if (!event.shiftKey) this.pressedKeys.delete("shift");

		if (!event.metaKey) this.pressedKeys.delete("meta");

		if (!event.altKey) this.pressedKeys.delete("alt");

		event.preventDefault();
	}

	private addKey(key: string) {
		this.pressedKeys.add(key);
		this.currentFrame.add(key);
	}

	public isDown(...keys: string[]): boolean {
		return !keys.some(x => !this.pressedKeys.has(x));
	}

	public isPressed(...keys: string[]): boolean {
		return !keys.some(x => !this.currentFrame.has(x));
	}

	public override update() {
		this.currentFrame.clear();
		this.wheel = 0;
	}
}
