import { Actor, AnimationStrategy, CollisionType, Engine, Keys, SpriteSheet, StateMachine, Vector } from "excalibur";
import { Resources } from "../resources";
import { AnimatedSprite } from "./AnimatedSprite";

export class Player extends Actor {
    spriteSheet: SpriteSheet;
    animatedSprite;

    constructor() {
        super({
            name: "Player",
            collisionType: CollisionType.Active
        });
        this.collider.useCircleCollider(8);

        this.spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerSpriteSheet,
            grid: {
                rows: 11,
                columns: 11,
                spriteWidth: 16,
                spriteHeight: 16,
            }
        });

        this.animatedSprite = new AnimatedSprite(this.spriteSheet, {
            idle: [0],
            idleLookAround: {
                frames: [0, 1],
                speed: 2500,
                fallback: "idle",
                allowedTransitions: ["idle", "dead", 'walk']
            },
            walk: {
                speed: 100,
                strategy: AnimationStrategy.Loop,
                frames: [2, 3, 4, 5, 6],
            },
            dead: {
                speed: 100,
                strategy: AnimationStrategy.Freeze,
                fallback: 'idle',
                frames: [7, 8, 9, 10, 11],
            }
        });
        this.addChild(this.animatedSprite);
    }

    onInitialize(engine: Engine): void {
        super.onInitialize(engine);


    }

    update(engine: Engine, delta: number): void {
        this.vel.setTo(0, 0);

        if (engine.input.keyboard.isHeld(Keys.Space)) {
            this.animatedSprite.setState("dead");
        }

        if (engine.input.keyboard.isHeld(Keys.A)) {
            this.vel.x = -100;
            this.animatedSprite.setState("walk");
            this.animatedSprite.graphics.flipHorizontal = true;
        }

        else if (engine.input.keyboard.isHeld(Keys.D)) {
            this.vel.x = 100;
            this.animatedSprite.setState("walk");
            this.animatedSprite.graphics.flipHorizontal = false;
        }

        if (engine.input.keyboard.isHeld(Keys.W)) {
            this.vel.y = -100;
            this.animatedSprite.setState("walk");
        }
        else if (engine.input.keyboard.isHeld(Keys.S)) {
            this.vel.y = 100;
            this.animatedSprite.setState("walk");
        }

        if (this.vel.equals(Vector.Zero, 0.01)) {
            if (this.animatedSprite.state !== 'idleLookAround') {
                this.animatedSprite.setState(Math.random() < 0.01 ? "idleLookAround" : "idle");
            }
        }
    }
}