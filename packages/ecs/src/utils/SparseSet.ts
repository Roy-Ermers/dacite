/**
* SparseSet is a data structure that allows for constant time addition, deletion, and lookup of elements.
* It is used in the ECS to store entities and components.
*/
export default class SparseSet<T> {
    #dense: T[] = [];
    #sparse: number[] = [];
    #size: number = 0;

    public get size() {
        return this.#size;
    }

    has(index: number) {
        return this.#sparse[index] !== undefined && this.#sparse[index] < this.#size;
    }

    get(index: number): T | null {
        if (!this.has(index)) {
            return null;
        }

        return this.#dense[this.#sparse[index]];
    }

    getKey(item: T) {
        return this.#sparse.indexOf(this.#dense.indexOf(item));
    }

    add(value: T): number {
        if (this.#dense.includes(value)) {
            return this.getKey(value);
        }

        this.#sparse[this.#dense.length] = this.#size;
        this.#dense.push(value);
        this.#size++;
        return this.#dense.length - 1;
    }

    set(index: number, value: T) {
        if (this.has(index)) {
            this.#dense[this.#sparse[index]] = value;
            return;
        }

        this.#sparse[index] = this.#dense.length;
        this.#dense.push(value);
        this.#size++;
    }

    delete(index: number): T | null {
        const denseIndex = this.#sparse[index];

        if (denseIndex === undefined || denseIndex >= this.#size) {
            return null;
        }

        const lastIndex = this.#size - 1;

        if (denseIndex !== lastIndex) {
            this.#dense[denseIndex] = this.#dense[lastIndex];
            const id = this.#sparse.indexOf(lastIndex);
            this.#sparse[id] = denseIndex;
        }

        this.#size--;
        delete this.#sparse[index];
        return this.#dense.pop() ?? null;
    }

    clear() {
        this.#dense = [];
        this.#sparse = [];
        this.#size = 0;
    }

    *keys() {
        for (let i = 0; i < this.#sparse.length; i++) {
            if (this.has(i)) {
                yield i;
            }
        }
    }

    *[Symbol.iterator]() {
        let index = 0;

        while (index < this.#size) {
            yield this.#dense[index++];
        }
    }
}
