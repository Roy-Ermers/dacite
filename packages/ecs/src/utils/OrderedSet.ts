interface Link<T> {
	item: T;
	next: Link<T> | null;
}

/**
 * Ordered set, keeps items in a specific order based on a priority field.
 * It sorts the item automatically in the correct position on insert.
 */
export default class OrderedSet<T> {
	private items: Link<T> | null = null;
	private _size = 0;

	/**
	 * Gets the number of items in the set.
	 */
	public get size() {
		return this._size;
	}

	/**
	 * Creates an instance of OrderedSet.
	 * @param sortField - The field used to sort the items.
	 * @param items - Initial items to add to the set.
	 */
	constructor(
		private sortField: keyof T,
		...items: T[]
	) {
		for (const item of items) this.add(item);
	}

	/**
	 * Adds an item to the set in the correct position based on the sortField.
	 * If the item already exists, it will not be added again.
	 * @param item - The item to add.
	 */
	public add(item: T): void;
	/**
	 * Adds an item to the set in the correct position based on the priority.
	 * If the item already exists, it will not be added again.
	 * @param item the item to add.
	 * @param priority override the priority.
	 */
	public add(item: T, priority: number): void;
	public add(item: T, _priority?: number) {
		const priority = _priority ?? item[this.sortField];
		console.log(item.constructor.name, priority);

		if (!this.items) {
			this.items = { item, next: null };
			this._size++;
			return;
		}

		let link = this.items;
		let previous: Link<T> | null = null;

		while (link.next && link.next.item[this.sortField] < priority) {
			if (link.item === item) return;

			previous = link;
			link = link.next;
		}

		if (link && link.item === item) return;

		const newNode: Link<T> = { item, next: link };

		if (previous) {
			previous.next = newNode;
		} else {
			this.items = newNode;
		}

		this._size++;
	}

	/**
	 * Gets the index of an item in the set.
	 * @param item - The item to find.
	 * @returns The index of the item, or -1 if not found.
	 */
	public indexOf(item: T): number {
		let index = 0;
		let link = this.items;

		while (link) {
			if (link.item[this.sortField] === item[this.sortField]) return index;
			link = link.next;
			index++;
		}

		return -1;
	}

	/**
	 * Checks if an item exists in the set.
	 * @param item - The item to check.
	 * @returns True if the item exists, false otherwise.
	 */
	public has(item: T): boolean {
		let link = this.items;

		while (link) {
			if (link.item === item) return true;
			link = link.next;
		}

		return false;
	}

	/**
	 * Deletes an item from the set.
	 * @param item - The item to delete.
	 */
	public delete(item: T) {
		if (!this.items) return;

		let link = this.items;
		while (link.next && link.next.item !== item) {
			link = link.next;
		}

		if (!link.next) return;

		link.next = link.next.next;
		this._size--;
	}

	/**
	 * Returns an iterator for the items in the set.
	 */
	*values() {
		let link = this.items;

		while (link) {
			yield link.item;
			link = link.next;
		}
	}

	/**
	 * Makes the set iterable.
	 */
	[Symbol.iterator] = this.values;

	/**
	 * Converts the set to an array.
	 * @returns An array of the items in the set.
	 */
	toArray() {
		return [...this.values()];
	}
}
