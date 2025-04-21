import { SpritesheetImporter } from "@dacite/core/tiles";
import type { Spritesheet } from "pixi.js";

const Resources = {
	Spritesheet: null as unknown as Spritesheet
};

async function load() {
	Resources.Spritesheet = await new SpritesheetImporter("tilemap_packed.png", {
		tileWidth: 8,
		tileHeight: 8,
		alias: {
			90: "idle",
			91: "walk_0",
			92: "jump",
			97: "balloon",
			34: "wall_top",
			132: "heart_full",
			134: "heart_empty"
		},
		animations: {
			idle: ["idle"],
			walk: ["walk_0", "jump"],
			jump: ["jump"]
		}
	}).build();
}

export default { Resources, load };
