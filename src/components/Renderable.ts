import { AnimatedSprite, Container, ContainerChild, Sprite } from "pixi.js";

export default class Renderable<T extends Container = Container<ContainerChild>> {
    public container: T;

    public constructor(public texture: T) {
        if (!(texture instanceof Container)) {
            throw new Error('Invalid texture type');
        }
        this.container = texture;

        if (texture instanceof Sprite) {
            texture.anchor.set(0.5);
        }

        if (texture instanceof AnimatedSprite)
            texture.play();
    }
}