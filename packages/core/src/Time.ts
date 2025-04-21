export default class Time {
	private _deltaTime = 0;
	private _lastTime: number | undefined;
	private _startTime = 0;

	private _callback: () => void;

	/**
	 * Time it took to render the last frame in milliseconds
	 */
	get deltaTime() {
		return this._deltaTime;
	}

	/**
	 * Time of the last frame was rendered in milliseconds
	 */
	get lastTime() {
		return this._lastTime ?? Number(document.timeline.currentTime) ?? 0;
	}

	/**
	 * Total time since the game started in milliseconds
	 */
	get totalTime() {
		return this._startTime + this.lastTime;
	}

	private update(time: number) {
		if (!this._startTime) {
			this._startTime = time;
		}

		requestAnimationFrame(this.update.bind(this));
		if (this._lastTime !== undefined) {
			this._deltaTime = Math.min(1 / 10, time - this._lastTime);
		}

		this._callback();

		this._lastTime = time;
	}

	constructor(callback: () => void) {
		this._callback = callback;
		requestAnimationFrame(this.update.bind(this));
	}
}
