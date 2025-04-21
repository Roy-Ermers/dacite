![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/roy-ermers/dacite/ci.yml?branch=main&label=CI&style=flat-square)
![GitHub](https://img.shields.io/github/license/roy-ermers/dacite?style=flat-square)
<!-- ![npm](https://img.shields.io/npm/v/@dacite/core?label=%40dacite%2Fcore&style=flat-square) -->
![npm](https://img.shields.io/npm/v/@dacite/ecs?label=%40dacite%2Fecs&style=flat-square)
<!-- ![npm](https://img.shields.io/npm/v/@dacite/ecs-inspector?label=%40dacite%2Fecs-inspector&style=flat-square) -->
![GitHub Repo stars](https://img.shields.io/github/stars/roy-ermers/dacite?style=flat-square)

# Dacite Monorepo

This repository contains a collection of packages and a playground for the Dacite framework. Dacite is a modular and extensible framework for building games and simulations using an Entity-Component-System (ECS) architecture. Below is an overview of the packages and their purposes.

---

## Packages

### 1. **@dacite/core**
The core package provides the foundational components, systems, and utilities for building games using Dacite. It includes physics, rendering, input handling, and more.

#### Features:
- **Entity-Component-System (ECS)** integration.
- Physics systems using `planck`.
- Rendering with `pixi.js`.
- Tilemap and sprite management.

#### Installation:
```bash
npm install @dacite/core
```

#### Usage:
```typescript
import Engine, { Vector2, Transform, Rigidbody } from "@dacite/core";

const game = new Engine();
await game.init();

const player = game.ecs.entity("Player")
    .set(new Transform(new Vector2(0, 0)))
    .set(new Rigidbody());
```

For more details, refer to the `@dacite/core` source code.

---

### 2. **@dacite/ecs**
A standalone ECS library that powers the Dacite framework. It provides a flexible and efficient way to manage entities, components, and systems.

#### Features:
- Lightweight and modular ECS implementation.
- Query-based entity filtering.
- Support for custom systems and component sets.

#### Installation:
```bash
npm install @dacite/ecs
```

#### Usage:
```typescript
import { Scope, EntitySystem, Query } from "@dacite/ecs";

const scope = new Scope();

class Position {
  constructor(public x: number, public y: number) {}
}

const entity = scope.entity("Player").set(new Position(10, 20));

class MovementSystem extends EntitySystem {
  query = new Query().has(Position);

  onEntityUpdated(entity) {
    const position = entity.get(Position);
    position.x += 1;
    position.y += 1;
  }
}

scope.addSystem(new MovementSystem());
scope.update();
```

For more details, refer to the `@dacite/ecs` README.

---

### 3. **@dacite/ecs-inspector**
A Vue-based developer tool for inspecting and debugging ECS entities and components in real-time.

#### Features:
- Entity list and search.
- Component inspection and editing.
- Real-time updates.

#### Installation:
```bash
npm install @dacite/ecs-inspector
```

#### Usage:
```typescript
import createInspector from "@dacite/ecs-inspector";
import { Scope } from "@dacite/ecs";

const scope = new Scope();
createInspector({ scope });
```

#### Example:
The inspector will appear as a sidebar in your application, allowing you to inspect and modify entities and components.

---

### 4. **@dacite/playground**
A playground application for testing and experimenting with the Dacite framework. It includes example entities, systems, and resources.

#### Features:
- Example player entity with animations and physics.
- Camera system with zoom and follow functionality.
- Heart system for collectible items.
- Player controller system for movement and jumping.

#### Usage:
Run the playground locally:
```bash
npm run dev
```

#### Example:
The playground demonstrates how to use the Dacite framework to create a simple game with a player, collectibles, and physics.

---

## Development

### Monorepo Structure
The repository is organized as a monorepo using the following structure:
```
dacite/
├── packages/
│   ├── core/          # Core package
│   ├── ecs/           # ECS library
│   ├── ecs-inspector/ # ECS Inspector
│   └── playground/    # Playground application
└── tsconfig.json      # Shared TypeScript configuration
```

### Building Packages
To build all packages:
```bash
npm run build
```

To build a specific package:
```bash
cd packages/<package-name>
npm run build
```

### Running the Playground
To start the playground:
```bash
cd packages/playground
npm run dev
```

---

## License
This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the Dacite framework.

---

Happy coding! 🎮
