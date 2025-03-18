
type EventDefinition = Record<string, (...args: any[]) => any>;

/**
* A simple event bus that allows you to listen for events and emit them.
*/
export default class EventBus<T extends EventDefinition> {
	private listeners: Map<string | number | symbol, Set<(...args: any[]) => void>> = new Map();

	on<K extends keyof T>(event: K, listener: T[K]) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}

		this.listeners.get(event)!.add(listener);

		const off = () => {
			this.off(event, listener);
		}

		off[Symbol.dispose] = off;

		return off;
	}

	off<K extends keyof T>(event: K, listener: T[K]) {
		if (!this.listeners.has(event)) {
			return;
		}

		this.listeners.get(event)!.delete(listener);
	}

	onAny(listener: (event: keyof T, ...args: any) => void) {
			this.on("*", listener as any);
	}

	emit(event: "*", eventName: string | symbol | number, ...args: any[]): void;
	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void;
	emit<K extends keyof T | string>(event: K, ...args: any[]) {
		if(this.listeners.has("*") && event !== "*") {
			this.emit("*", event, ...args);
		}

		if (!this.listeners.has(event)) {
			return;
		}

		for (const listener of this.listeners.get(event)!) {
			listener(...args);
		}
	}
}
