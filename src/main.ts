import { Color, DisplayMode, Engine, ImageFiltering } from "excalibur";
import { loader } from "./resources";
import { Player } from "./entities/Player";

const game = new Engine({
  pixelArt: true,
  antialiasing: {
    filtering: ImageFiltering.Pixel,
    canvasImageRendering: "pixelated",
    multiSampleAntialiasing: false,
    pixelArtSampler: true
  },
  backgroundColor: Color.Black,
  displayMode: DisplayMode.FitScreenAndFill,
});

await game.start(loader);

const player = new Player();
game.currentScene.camera.strategy.radiusAroundActor(player, 32);

game.add(player);