import { Collider } from "@scout/engine";
import ComponentSet from "./src/Components/ComponentSet";
import { ComponentTypeSymbolConstructor } from "./src/Components/ComponentTypes";
import Entity from "./src/Entities/Entity";
import Scope from "./src/Scope";
import Query from "./src/Queries/Query";


const scope = new Scope();
class Transform {
	constructor(public x: number, public y: number) { }
}
class NameTag {
	constructor(public name: string) { }
}
class Collision {
	constructor(public other: Entity) { }
}

const CollisionComponentSet = ComponentSet.create(Collision);

const tag = Symbol("Tag");

const entity = scope.entity()
	.set(new Transform(0, 0))
	.set(new NameTag("Hello"))
	.set(tag)
	.set(new CollisionComponentSet(new Collision(scope.entity())));


const collisions = entity.get(CollisionComponentSet);
const position = entity.get(Transform);
const name = entity.get(NameTag);

for (const collision of collisions) {
	console.log(collision.other.get(NameTag));
}

entity.remove(NameTag);

position.x = 0;
name.name = "Hello";

const query = new Query(entity => entity.get(NameTag)?.name === 'Hello');

console.log(query.dependencies);
