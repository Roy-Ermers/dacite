import { ContactComponentSet, Renderable } from "@dacite/core";
import {
	type Entity,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import { Sprite } from "pixi.js";
import { HEART } from "../components/Tags";
import Resources from "../resources/Resources";

export default class HeartSystem extends EntitySystem {
	heartEmpty: Sprite;
	heartFilled: Sprite;

	override get query() {
		return new Query().has(ContactComponentSet).has(Renderable).has(HEART);
	}

	constructor() {
		super();

		this.heartFilled = Sprite.from(
			Resources.Resources.Spritesheet.textures.heart_full
		);
		this.heartEmpty = Sprite.from(
			Resources.Resources.Spritesheet.textures.heart_empty
		);
	}

	protected override onEntityUpdated(
		entity: Entity<InferQuerySet<this["query"]>>
	): void {
		const contacts = entity.get(ContactComponentSet);
		const renderable = entity.get(Renderable);
		if (contacts.size === 0) {
			renderable.setTexture(this.heartEmpty);
			return;
		}

		renderable.setTexture(this.heartFilled);
	}
}
