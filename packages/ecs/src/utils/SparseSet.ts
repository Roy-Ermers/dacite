/**
 * SparseSet is a data structure that allows for constant time addition, deletion, and lookup of elements.
 * It is used in the ECS to store entities and components.
 */
export default class SparseSet<T> {
	private dense: T[] = [];
	private sparse: number[] = [];
	private _size = 0;

	public get size() {
		return this._size;
	}

	/**
	 * Check if a given index exists in the set
	 * @param index check if index exists
	 * @returns true if index exists
	 */
	has(index: number) {
		return this.sparse[index] !== undefined && this.sparse[index] < this._size;
	}

	/**
	 * Get the value at the given index
	 * @param index index to get
	 * @returns value at index
	 */
	get(index: number): T | null {
		if (!this.has(index)) {
			return null;
		}

		return this.dense[this.sparse[index]];
	}

	/**
	 * Get the index of the given item
	 * @param item item to get index of
	 * @returns index of item
	 */
	getKey(item: T) {
		return this.sparse.indexOf(this.dense.indexOf(item));
	}

	/**
	 * Add a value to the set
	 * @param value value to add
	 * @returns index of value
	 */
	add(value: T): number {
		if (this.dense.includes(value)) {
			return this.getKey(value);
		}

		this.sparse[this.dense.length] = this._size;
		this.dense.push(value);
		this._size++;
		return this.dense.length - 1;
	}

	/**
	 * Set a value at a given index
	 * @param index index to set
	 * @param value value to set
	 */
	set(index: number, value: T) {
		if (this.has(index)) {
			this.dense[this.sparse[index]] = value;
			return;
		}

		this.sparse[index] = this.dense.length;
		this.dense.push(value);
		this._size++;
	}

	/**
	 * Delete a value at a given index
	 * @param index index to delete
	 * @returns value at index
	 */
	delete(index: number): T | null {
		const denseIndex = this.sparse[index];

		if (denseIndex === undefined || denseIndex >= this._size) {
			return null;
		}

		const lastIndex = this._size - 1;

		if (denseIndex !== lastIndex) {
			this.dense[denseIndex] = this.dense[lastIndex];
			const id = this.sparse.indexOf(lastIndex);
			this.sparse[id] = denseIndex;
		}

		this._size--;
		delete this.sparse[index];
		return this.dense.pop() ?? null;
	}

	/**
	 * Clear the set
	 */
	clear() {
		this.dense = [];
		this.sparse = [];
		this._size = 0;
	}

	/**
	 * Iterate over the keys in the set
	 */
	*keys() {
		for (let i = 0; i < this.sparse.length; i++) {
			if (this.has(i)) {
				yield i;
			}
		}
	}

	/**
	 * Iterate over the values in the set
	 */
	*values() {
		let index = 0;

		while (index < this._size) {
			yield this.dense[index++];
		}
	}

	/**
	 * Iterate over the values in the set
	 */
	*[Symbol.iterator]() {
		yield* this.values();
	}
}
