import { DefaultLoader, ImageSource } from "excalibur";

export const Resources = {
    SewersSpriteSheet: new ImageSource('/tiles_sewers.png'),
    PlayerSpriteSheet: new ImageSource('/player.png'),
} as const;

export const loader = new DefaultLoader();

loader.addResources(Object.values(Resources));