import { Actor, Animation, AnimationStrategy, SpriteSheet } from "excalibur";

export type AnimationDefinition = number[] | {
    frames: number[],
    /**
     * Duration of each frame in milliseconds
     */
    speed: number;

    allowedTransitions?: string[];

    strategy?: AnimationStrategy;

    fallback?: string;
}
export class AnimatedSprite<T extends string> extends Actor {
    private spriteSheet: SpriteSheet;
    private states: Record<string, {
        animation: Animation;
        fallback?: string;
        allowedTransitions?: string[];
    }> = {};

    private _state!: T;
    public get state() { return this._state };

    public get currentAnimation() {
        return this.states[this._state];
    }

    constructor(spritesheet: SpriteSheet, animations: Record<T, AnimationDefinition>) {
        super();
        this.spriteSheet = spritesheet;


        for (const name in animations) {
            const def = animations[name];
            if (Array.isArray(def)) {
                this.states[name] = { animation: Animation.fromSpriteSheet(this.spriteSheet, def, 100) };
            } else {
                this.states[name] = {
                    animation: Animation.fromSpriteSheet(this.spriteSheet, def.frames, def.speed, def.strategy ?? AnimationStrategy.Loop),
                    fallback: def.fallback,
                    allowedTransitions: def.allowedTransitions
                }
            }
        }

        this.setState(Object.keys(animations)[0] as T);
    }

    public setState(state: T) {
        if (this._state === state) return;

        const oldState = this.states[this._state];

        if (oldState) {
            if (oldState.allowedTransitions && !oldState.allowedTransitions.includes(state)) {
                console.log(`Transition from ${this._state} to ${state} not allowed`);

                return;
            }

            // if animation has a fallback wait until the animation is done
            if (oldState.fallback && !oldState.animation.done) {
                return;
            }
        }

        this._state = state;
        this.states[this._state].animation.reset();

        this.graphics.use(this.states[this._state].animation);
    }

    update() {
        if (this.currentAnimation.animation.done && this.currentAnimation.fallback) {
            this.setState(this.currentAnimation.fallback as T);
        }
    }
}
