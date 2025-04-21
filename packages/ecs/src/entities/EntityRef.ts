import type Scope from "..";
import type Entity from "./Entity";

export default class EntityRef {
	private scope: Scope | null = null;
	private entityId: number | null = null;

	private _isDead = false;

	public get value(): Entity | null {
		if (this._isDead || this.entityId === null || this.scope === null)
			return null;
		return this.scope.getEntityById(this.entityId);
	}

	public set value(entity: Entity | null) {
		this._isDead = entity === null;
		this.entityId = entity?.id ?? null;
		this.scope = entity?.scope ?? null;
	}

	public get isDead() {
		return this._isDead;
	}

	constructor(entity: Entity);
	constructor();
	constructor(entity?: Entity) {
		if (!entity) return;
		this.entityId = entity.id;
		this.scope = entity.scope;

		this.attachEvent();
	}

	private attachEvent() {
		if (!this.scope) return;
		this.scope.eventbus.on("entitydestroyed", entity => {
			if (entity.id === this.entityId) this._isDead = true;
		});
	}
}
