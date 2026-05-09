import "./styles.css";
import { GameState } from "./game/GameState";
import { BabylonApp } from "./render/BabylonApp";
import { HUD } from "./ui/HUD";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
const uiRoot = document.querySelector<HTMLElement>("#ui-root");

if (!canvas || !uiRoot) {
  throw new Error("Mulberry Alone could not find the canvas or UI root.");
}

const state = new GameState();
new HUD(uiRoot, state);
const app = new BabylonApp(canvas, state);
app.start();
