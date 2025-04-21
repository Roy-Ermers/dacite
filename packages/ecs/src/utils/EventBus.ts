type EventDefinition = Record<string, EventHandler>;

// biome-ignore lint: We don't care about the argument types.
type EventHandler = (...args: any[]) => void;

interface EventOptions {
	once?: boolean;
}

/**
 * A simple event bus that allows you to listen for events and emit them.
 */
export default class EventBus<T extends EventDefinition> {
	private listeners: Map<string | number | symbol, Set<EventHandler>> =
		new Map();

	/**
	 * Attach a event handler.
	 * @param event Event to listen to
	 * @param listener The listener that is called when the event is raised
	 * @returns A function that detaches the listener
	 */
	on<K extends keyof T>(event: K, listener: T[K]): () => void;
	/**
	 * Listen for all events
	 * @param event alsways "*"
	 * @param listener The listener to attach, first argument is the actual argument raised, and afterwards all arguments passed with it.
	 * @returns A function that detaches the listener
	 */
	on<K extends keyof T>(
		event: "*",
		listener: (event: keyof K, ...args: unknown[]) => void
	): () => void;
	on<K extends keyof T>(
		event: K | "*",
		listener: T[K] | ((event: keyof K, ...args: unknown[]) => void)
	) {
		let listenerSet = this.listeners.get(event);

		if (!listenerSet) {
			listenerSet = new Set<EventHandler>();
			this.listeners.set(event, listenerSet);
		}

		listenerSet.add(listener);

		const off = () => {
			this.off(event, listener);
		};

		off[Symbol.dispose] = off;

		return off;
	}

	once<K extends keyof T>(event: K, listener: T[K]) {
		const onceListener = (...args: Parameters<T[K]>) => {
			this.off(event as K, onceListener as T[K]);
			listener(...args);
		};

		this.on(event as K, onceListener as T[K]);
	}

	/**
	 * Detach a listener from a event
	 * @param event Event to detach from
	 * @param listener Listener to detach
	 */
	off<K extends keyof T>(event: K, listener: T[K]): void;

	/**
	 * Detach a listener from a event
	 * @param event Event to detach from
	 * @param listener Listener to detach
	 */
	off<K extends keyof T>(
		event: "*",
		listener: (event: keyof K, ...args: unknown[]) => void
	): void;
	/**
	 * Detach a listener from a event
	 * @param event Event to detach from
	 * @param listener Listener to detach
	 */
	off<K extends keyof T>(
		event: K | "*",
		listener: T[K] | ((event: keyof K, ...args: unknown[]) => void)
	): void;
	off<K extends keyof T>(
		event: K | "*",
		listener: T[K] | ((event: keyof K, ...args: unknown[]) => void)
	) {
		const listenerSet = this.listeners.get(event);

		if (!listenerSet) {
			return;
		}

		listenerSet.delete(listener);
	}

	/**
	 * Emit a event with the given arguments
	 * @param event Event to emit
	 * @param args Passed arguments with it
	 */
	emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void;
	/**
	 * Emit a event with the given arguments
	 * @param event event to emit
	 * @param eventName the event that is raised
	 * @param args all the args passed to this event
	 */
	emit(
		event: "*",
		eventName: string | symbol | number,
		...args: unknown[]
	): void;
	emit<K extends keyof T>(event: K | "*", ...args: unknown[]): void;
	emit<K extends keyof T>(event: K, ...args: unknown[]) {
		if (this.listeners.has("*") && event !== "*") {
			this.emit("*", event, ...args);
		}

		const listenerSet = this.listeners.get(event);

		if (!listenerSet) {
			return;
		}

		for (const listener of listenerSet) {
			listener(...args);
		}
	}
}
