import { AnimatedSprite, Container, Sprite, Texture } from "pixi.js";

export default class Renderable {
    public container: Container;

    public constructor(public texture: Texture | Container | string) {
        if (texture instanceof Container) {
            this.container = texture;

            if (texture instanceof AnimatedSprite)
                texture.play();

            return;
        }



        if (texture instanceof Texture || typeof texture === 'string') {
            this.container = Sprite.from(texture);
            return;
        }

        throw new Error('Invalid texture type');
    }
}