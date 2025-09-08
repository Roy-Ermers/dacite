import type Scope from "..";
import type Entity from "./Entity";

export default class EntityRef {
	private _scope: Scope | null = null;
	private entityId: number | null = null;

	private _isDead = false;

	public get value(): Entity | null {
		if (this._isDead || this.entityId === null || this._scope === null)
			return null;
		return this._scope.getEntityById(this.entityId);
	}

	public set value(entity: Entity | null) {
		this._isDead = entity === null;
		this.entityId = entity?.id ?? null;
		this.scope = entity?.scope ?? null;
	}

	public get isDead() {
		return this._isDead;
	}

	public get scope() {
		return this._scope;
	}

	private set scope(value: Scope | null) {
		if (!value) {
			this.clear();

			return;
		}
		if (value === this._scope) return;

		this._scope = value;
		this.attachEvent();
	}

	constructor(entity: Entity);
	constructor();
	constructor(entity?: Entity) {
		if (!entity) {
			this._isDead = true;
			return;
		}

		this.entityId = entity.id;
		this.scope = entity.scope;
	}

	private attachEvent() {
		if (!this._scope) return;
		this._scope.eventbus.on("entitydestroyed", entity => {
			if (entity.id === this.entityId) this.clear();
		});
	}

	private clear() {
		this._isDead = true;
		this.entityId = null;
		this._scope = null;
	}
}
