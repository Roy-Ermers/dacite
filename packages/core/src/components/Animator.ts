import { AnimatedSprite, Spritesheet } from "pixi.js";
import Renderable from "./Renderable";

interface AnimationState {
    /**
     * The name of the animation in the spritesheet
     */
    animation: string;
    /**
     * Speed of the animation in frames per second
     */
    speed: number;

    /**
     *
     */
    oneShot?: {
        next: string;
    } | true;
}

interface AnimatorStates<T extends string> {
    spriteSheet: Spritesheet;
    states: Record<T, AnimationState>;
    defaultState?: string;
}

export default class Animator<T extends string = string> extends Renderable<AnimatedSprite> {
    private _currentStateKey: T;

    public get currentStateKey(): T {
        return this._currentStateKey;
    }

    public set currentStateKey(state: T) {
        if (this._currentStateKey === state) return;

        this._currentStateKey = state;
        const animation = this.data.states[state];
        this.container.textures = this.data.spriteSheet.animations[animation.animation];
        this.container.animationSpeed = animation.speed / 60;
        this.container.gotoAndPlay(0);
        this.container.loop = !animation.oneShot;
    }

    public get currentState(): AnimationState {
        return this.data.states[this._currentStateKey];
    }

    public set flipped(value: boolean) {
        if (this.flipped === value) return;

        this.container.scale.x = value ? -1 : 1;
    }

    public get flipped() {
        return this.container.scale.x === -1;
    }

    constructor(public readonly data: AnimatorStates<T>) {
        const currentState = (data.defaultState as T) ?? (Object.keys(data.states)[0] as T);

        super(new AnimatedSprite(data.spriteSheet.animations[data.states[currentState].animation]));
        this.container.anchor.set(0.5);
        this.container.animationSpeed = data.states[currentState].speed / 60;
        this._currentStateKey = currentState;

        this.container.onComplete = () => {
            if (this.currentState.oneShot) {
                if (this.currentState.oneShot === true) {
                    this.container.stop();
                    return;
                }

                this.currentStateKey = this.currentState.oneShot.next as T;
            }
        };
    }

}