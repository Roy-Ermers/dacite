import { ComponentSet, EntityRef, type Scope } from "@dacite/ecs";
import type { Fixture, Manifold, Contact as PhysicsContact } from "planck";

export default class Contact {
	private _entityA = new EntityRef();
	private _entityB = new EntityRef();

	private _manifold: Manifold | null = null;

	private get manifold() {
		if (this._manifold) return this._manifold;

		const manifold = this.contact.getManifold();

		this._manifold = manifold;
		return this._manifold;
	}

	get normal() {
		return this.manifold.localNormal;
	}

	get A() {
		return this._entityA;
	}
	get B() {
		return this._entityB;
	}

	constructor(
		private contact: PhysicsContact,
		scope: Scope
	) {
		const a = contact.getFixtureA();
		const b = contact.getFixtureB();

		this._entityA.value = Contact.findEntity(a, scope);
		this._entityB.value = Contact.findEntity(b, scope);
	}

	public static findEntity(fixture: Fixture, scope: Scope) {
		const userData = fixture.getUserData();
		if (typeof userData !== "number") {
			return null;
		}

		const entity = scope.getEntityById(userData);

		return entity ?? null;
	}

	/**
	 * @internal
	 * @param contact contact to compare to.
	 * @returns
	 */
	public equals(contact: PhysicsContact) {
		return this.contact === contact;
	}
}

const ContactComponentSet = ComponentSet.create(Contact);

export { ContactComponentSet };
