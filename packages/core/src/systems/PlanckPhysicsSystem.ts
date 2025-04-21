import {
	type Entity,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import {
	type Body,
	BoxShape,
	CircleShape,
	EdgeShape,
	Settings,
	type Shape,
	World
} from "planck";
import type { Contact as PhysicsContact } from "planck";
import { ForceComponentSet } from "../components/Force.ts";
import Rigidbody from "../components/Rigidbody.ts";
import Transform from "../components/Transform.ts";
import PlaneCollider from "../components/colliders/PlaneCollider.ts";
import {
	BoxCollider,
	CircleCollider,
	Collider,
	Contact,
	ContactComponentSet
} from "../components/index.ts";
import Engine from "../index.ts";
import Vector2 from "../utils/Vector2.ts";

interface PhysicsSystemOptions {
	gravity?: Vector2;
	defaults?: {
		/**
		 * The default damping value for rigidbodies.
		 * This value controls how much velocity is lost over time due to friction and other forces.
		 * @default 0.1
		 */
		damping?: number;
		/**
		 * The default angular damping value for rigidbodies.
		 * This value controls how much angular velocity is lost over time due to friction and other forces.
		 * @default 0.1
		 */
		angularDamping?: number;
		/**
		 * The default mass of a rigidbody, this unit is in kilograms
		 * @default 0
		 */
		mass?: number;
	};
}

export default class PhysicsSystem extends EntitySystem {
	get query() {
		return new Query().has(Collider).has(Transform);
	}

	physicsWorld: World;
	fixedTimeStep = 1;
	bodies = new Map<number, Body>();

	constructor(options: PhysicsSystemOptions = {}) {
		super();
		this.physicsWorld = new World({
			gravity: options.gravity,
			allowSleep: true
		});
		this.physicsWorld.on("begin-contact", contact =>
			this.onContactStart(contact)
		);
		this.physicsWorld.on("end-contact", contact => this.onContactEnd(contact));

		Settings.lengthUnitsPerMeter = 16;
	}

	override update(): void {
		this.physicsWorld.step(this.fixedTimeStep * Engine.instance.time.deltaTime);
		super.update();
	}

	private onContactStart(contact: PhysicsContact) {
		const component = new Contact(contact, this.scope);
		const a = component.A.value;
		const b = component.B.value;

		const addContact = (entity: Entity, contact: Contact) => {
			const contacts = entity.getComponentSet(ContactComponentSet);

			contacts.add(contact);
		};

		if (a) addContact(a, component);
		if (b) addContact(b, component);
	}

	private onContactEnd(contact: PhysicsContact) {
		const a = Contact.findEntity(contact.getFixtureA(), this.scope);
		const b = Contact.findEntity(contact.getFixtureB(), this.scope);

		const removeContact = (entity: Entity) => {
			const contacts = entity.get(ContactComponentSet);

			if (!contacts) return;
			const existingContact = contacts.find(x => x.equals(contact));
			if (!existingContact) return;

			contacts.delete(existingContact);
		};

		if (a) removeContact(a);
		if (b) removeContact(b);
	}

	protected override onEntityUpdated(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const rigidbody = entity.get(Rigidbody);
		const transform = entity.get(Transform);

		const body = this.bodies.get(entity.id);

		if (!body || !rigidbody) return;
		const forces = entity.get(ForceComponentSet);

		const center = body.getWorldCenter();

		if (forces) {
			for (const force of forces) {
				if (force.type === "force")
					body.applyForce(force.direction, force.point ?? center);
				if (force.type === "impulse")
					body.applyLinearImpulse(force.direction, force.point ?? center);
				forces.delete(force);
			}
		}

		const velocity = body.getLinearVelocity();
		rigidbody._velocity.x = velocity.x;
		rigidbody._velocity.y = velocity.y;

		const position = body.getPosition();
		transform.position.x = position.x;
		transform.position.y = -position.y;

		transform.rotation = body.getAngle();
	}

	private addColliders(entity: Entity, body: Body) {
		const collider = entity.get(Collider);
		const transform = entity.get(Transform);

		if (!transform) return;

		let shape: Shape;

		if (collider instanceof BoxCollider) {
			shape = new BoxShape(collider.width / 2, collider.height / 2);
		} else if (collider instanceof CircleCollider) {
			shape = new CircleShape(Vector2.zero, collider.radius);
		} else if (collider instanceof PlaneCollider) {
			shape = new EdgeShape(collider.start, collider.end);
		} else {
			console.warn("Unknown collider type: ", collider);
			return;
		}

		body.createFixture({
			shape,
			density: collider.density,
			friction: collider.friction,
			restitution: collider.restitution,
			isSensor: collider.isSensor,
			userData: entity.id
		});
	}

	protected override onEntityAdded(
		entity: Entity<InferQuerySet<this["query"]>>
	): void {
		const rigidbody = entity.get(Rigidbody);
		const transform = entity.get(Transform);

		const type = rigidbody?.type ?? "static";

		const body = this.physicsWorld.createBody({
			type,
			position: transform.position,
			angle: transform.rotation,
			fixedRotation: rigidbody?.fixedRotation,
			linearDamping: rigidbody?.damping,
			userData: entity.id
		});

		this.addColliders(entity, body);

		this.bodies.set(entity.id, body);
	}

	protected override onEntityRemoved(
		entity: Entity<InferQuerySet<this["query"]>>
	): void {
		const rigidbody = entity.get(Rigidbody);

		if (!rigidbody) return;

		const body = this.bodies.get(entity.id);
		if (!body) return;
		this.bodies.delete(entity.id);
		this.physicsWorld.destroyBody(body);
	}
}
