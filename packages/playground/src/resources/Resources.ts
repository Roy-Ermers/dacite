import { SpritesheetImporter } from "@dacite/core/tiles";
import type { Spritesheet } from "pixi.js";

const Resources = {
	TileSpritesheet: null as unknown as Spritesheet,
	PlayerSpritesheet: null as unknown as Spritesheet
};

async function load() {
	Resources.PlayerSpritesheet = await new SpritesheetImporter("player.png", {
		tileWidth: 16,
		tileHeight: 16,
		alias: {
			37: "idle_0",
			38: "idle_1",
			39: "walk_0",
			40: "walk_1",
			41: "walk_2",
			42: "walk_3",
			43: "walk_4",
			44: "walk_5",
			8: "dead_0",
			9: "dead_1",
			10: "dead_2",
			11: "dead_3",
			12: "dead_4"
		},
		animations: {
			idle: ["idle_0"],
			idle_lookaround: ["idle_0", "idle_1"],
			walk: ["walk_0", "walk_1", "walk_2", "walk_3", "walk_4", "walk_5"],
			dead: ["dead_0", "dead_1", "dead_2", "dead_3", "dead_4"],
			resurection: ["dead_4", "dead_3", "dead_2", "dead_1", "dead_0"]
		}
	}).build();

	Resources.TileSpritesheet = await new SpritesheetImporter("tiles1.png", {
		tileWidth: 16,
		tileHeight: 16,
		alias: {
			1: "floor",
			2: "floor_moss",
			3: "pit",
			4: "wall",
			5: "door_closed",
			6: "door_open",
			7: "stairs_up",
			8: "stairs_down",
			9: "floor_embers",
			10: "door_locked"
		}
	}).build();
}

export default { Resources, load };
