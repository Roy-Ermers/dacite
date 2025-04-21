import Engine from "@dacite/core";
import {
	Animator,
	ContactComponentSet,
	Controller,
	ForceComponentSet,
	Impulse,
	Rigidbody
} from "@dacite/core/components";
import { InputSystem } from "@dacite/core/systems";
import { Vector2 } from "@dacite/core/utils";
import {
	type Entity,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import PLAYER_CONTROLLER from "../components/PlayerController.ts";
import { IS_GROUNDED } from "../components/Tags.ts";

export default class PlayerControllerSystem extends EntitySystem {
	private coyoteTime = 0.1;
	private coyoteTimer = new Map<number, number>();
	private doubleJumpAllowed = true;
	private airControlFactor = 0.5;

	get query() {
		return new Query().has(PLAYER_CONTROLLER).has(Rigidbody).has(Controller);
	}

	override onEntityUpdated(entity: Entity<InferQuerySet<this["query"]>>) {
		const controller = entity.get(Controller);
		const animator = entity.get(Animator);
		const rigidbody = entity.get(Rigidbody);

		const direction = this.getInputDirection();

		// Check if the player is grounded
		const isGrounded = this.isEntityGrounded(entity);

		entity.toggleTag(IS_GROUNDED, isGrounded);

		// Handle jumping logic
		this.handleJumping(entity, controller);

		// Apply movement forces
		this.applyMovementForces(entity, direction, controller, isGrounded);

		// Update animation state
		if (animator)
			this.updateAnimationState(animator, rigidbody, direction, isGrounded);
	}

	/**
	 * Get the movement direction based on input.
	 */
	private getInputDirection(): Vector2 {
		const direction = Vector2.zero;
		if (InputSystem.instance.isDown("s")) {
			direction.y -= 1;
		}
		if (InputSystem.instance.isDown("a")) {
			direction.x -= 1;
		}
		if (InputSystem.instance.isDown("d")) {
			direction.x += 1;
		}

		return direction;
	}

	/**
	 * Check if the entity is grounded.
	 */
	private isEntityGrounded(entity: Entity): boolean {
		// Check if the rigidbody's vertical velocity is near zero (indicating it's on the ground)
		const contacts = entity.get(ContactComponentSet);
		if (!contacts) return false;
		return contacts.size > 0;
	}

	/**
	 * Handle jumping logic, including coyote time and double jump.
	 */
	private handleJumping(entity: Entity, controller: Controller) {
		const entityId = entity.id;
		const isGrounded = entity.hasTag(IS_GROUNDED);

		// Update coyote timer
		const remainingCoyoteTime = isGrounded
			? this.coyoteTime
			: Math.max(
					(this.coyoteTimer.get(entityId) ?? 0) -
						Engine.instance.time.deltaTime,
					0
				);
		this.coyoteTimer.set(entityId, remainingCoyoteTime);

		// Check if the player can jump
		const canJump = isGrounded || remainingCoyoteTime > 0;

		// Handle jump input
		if (InputSystem.instance.isPressed("w")) {
			const forceSet = entity.getComponentSet(ForceComponentSet);

			if (canJump || this.doubleJumpAllowed) {
				// Perform jump or double jump
				forceSet.add(new Impulse(new Vector2(0, controller.jumpForce)));
				this.doubleJumpAllowed = canJump; // Reset double jump only if grounded
				if (canJump) this.coyoteTimer.set(entityId, 0); // Reset coyote timer
			}
		}

		// Reset double jump when grounded
		if (isGrounded) this.doubleJumpAllowed = true;
	}

	/**
	 * Apply movement forces to the entity's rigidbody.
	 */
	private applyMovementForces(
		entity: Entity,
		direction: Vector2,
		controller: Controller,
		isGrounded: boolean
	) {
		// Scale movement speed based on whether the player is grounded or in the air
		const movementFactor = isGrounded ? 1 : this.airControlFactor;

		// Normalize direction and scale by speed
		if (direction.length > 0.01) {
			direction
				.normalize(direction)
				.multiply(
					controller.speed * movementFactor,
					controller.speed * movementFactor,
					direction
				);

			// Add an impulse force to the entity
			const forces = entity.getComponentSet(ForceComponentSet);

			forces.add(new Impulse(direction));
		}
	}

	/**
	 * Update the animation state based on movement and random idle behavior.
	 */
	private updateAnimationState(
		animator: Animator | undefined,
		rigidbody: Rigidbody,
		direction: Vector2,
		isGrounded: boolean
	) {
		if (!animator) return;

		// Flip the sprite based on movement direction
		if (direction.x !== 0) {
			animator.flipped = direction.x < 0;
		}

		// Determine animation state based on velocity and grounded state
		if (isGrounded) {
			if (Math.abs(rigidbody.velocity.x) > 0.01) {
				animator.currentStateKey = "walk";
			} else {
				animator.currentStateKey = "idle";
			}
		} else {
			// Use "jump" animation when in the air
			animator.currentStateKey = "jump";
		}
	}
}
