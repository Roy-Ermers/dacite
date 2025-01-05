import { Assets, Spritesheet, SpritesheetFrameData, Texture, type SpritesheetData } from "pixi.js";

export interface SpritesheetDefinition {
    tileWidth: number;
    tileHeight: number;

    scale?: number;

    alias?: Record<number, string>;

    animations?: {
        [name: string]: number[];
    }
}

export default class SpritesheetImporter {
    private horizontalTiles: number = 1;
    private verticalTiles: number = 1;

    constructor(private texture: string, private data: SpritesheetDefinition) {
        this.data.alias = this.data.alias || {};
    }

    private generateFrames() {
        const frames: Record<string, SpritesheetFrameData> = {};
        for (let x = 0; x < this.horizontalTiles; x++) {
            for (let y = 0; y < this.verticalTiles; y++) {
                const frameData: SpritesheetFrameData = {
                    frame: {
                        x: x * this.data.tileWidth,
                        y: y * this.data.tileHeight,
                        w: this.data.tileWidth,
                        h: this.data.tileHeight
                    },
                };

                const index = x + y * this.horizontalTiles;
                const alias = this.data.alias?.[index] ?? index.toString();
                frames[alias] = frameData;
            }
        }

        return frames;
    }

    private generateAnimations() {
        if (!this.data.animations) {
            return {};
        }

        const animations: Record<string, string[]> = {};
        for (const [name, frames] of Object.entries(this.data.animations)) {
            animations[name] = frames.map(frame => frame.toString());
        }
        return animations;
    }

    public async build(): Promise<Spritesheet> {
        const texture = await Assets.load<Texture>("tiles1.png");
        this.horizontalTiles = Math.floor(texture.width / this.data.tileWidth);
        this.verticalTiles = Math.floor(texture.height / this.data.tileHeight);

        const spriteSheetData: SpritesheetData = {
            frames: this.generateFrames(),
            meta: {
                image: this.texture.toString(),
                format: "RGBA8888",
                scale: 1,
                size: {
                    w: texture.width,
                    h: texture.height
                }
            },
            animations: this.generateAnimations()
        };

        const spritesheet = new Spritesheet(texture, spriteSheetData);

        await spritesheet.parse();

        return spritesheet;
    }
}