# @dacite/ecs

`@dacite/ecs` is an Entity Component System (ECS) library for JavaScript and TypeScript. It provides a flexible and efficient way to manage entities and their components, allowing for easy creation, manipulation, and querying of entities in a game or simulation environment.

## Installation

To install the package, use npm:

```bash
npm install @dacite/ecs
```

## Usage

### Basic Example

Here is a basic example of how to use `@dacite/ecs`:

```typescript
import { Scope, Entity, ComponentSet, System, EntitySystem, Query } from '@dacite/ecs';

// Define a component
class Position {
  constructor(public x: number, public y: number) {}
}

// Create a new scope
const scope = new Scope();

// Create an entity and add a component to it
const entity = scope.entity('Player');
entity.set(new Position(10, 20));

// Define a system that operates on entities with a Position component
class MovementSystem extends EntitySystem {
  query = new Query().has(Position);

  onEntityUpdated(entity: Entity) {
    const position = entity.get(Position);
    if (position) {
      position.x += 1;
      position.y += 1;
    }
  }
}

// Add the system to the scope
scope.addSystem(new MovementSystem());

// Update the scope to process systems
scope.update();
```

### Components

Components are simple classes that hold data. You can create a component by defining a class:

```typescript
class Velocity {
  constructor(public dx: number, public dy: number) {}
}
```

### Entities

Entities are created using the `Scope` class. You can add components to entities and query them:

```typescript
const entity = scope.entity('Enemy');
entity.set(new Velocity(1, 1));
```

### Systems

Systems are used to something. You can create a system by extending the `System` or `EntitySystem` class:

```typescript
class RenderSystem extends EntitySystem {
  query = new Query().has(Position);

  onEntityUpdated(entity: Entity) {
    const position = entity.get(Position);
    if (position) {
      console.log(`Rendering entity at (${position.x}, ${position.y})`);
    }
  }
}

class TimeSystem extends System {
	update() {
		console.log('TimeSystem update');
	}
}

scope.addSystem(new RenderSystem())
	.addSystem(new TimeSystem());

scope.update();
```

### Queries

Queries are used to filter entities based on their components:

```typescript
const query = new Query().has(Position).has(Velocity);

for (const entity of query.execute(scope)) {
  const position = entity.get(Position);
  const velocity = entity.get(Velocity);
  if (position && velocity) {
    position.x += velocity.dx;
    position.y += velocity.dy;
  }
}
```

## Development

To build the package, run:

```bash
npm run build
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
