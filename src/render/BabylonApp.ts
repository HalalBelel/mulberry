import { Engine, Scene } from "@babylonjs/core";
import type { GameState } from "../game/GameState";
import { GameTicker } from "../game/tick";
import { Player } from "../world/Player";
import { World } from "../world/World";
import { CameraController } from "./CameraController";
import { InteractionSystem } from "./InteractionSystem";
import { Materials } from "./Materials";
import { createSceneFoundation } from "./SceneFactory";

export class BabylonApp {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly camera: CameraController;
  private readonly interaction: InteractionSystem;
  private readonly ticker = new GameTicker();

  constructor(canvas: HTMLCanvasElement, private readonly state: GameState) {
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, antialias: true });
    this.scene = new Scene(this.engine);
    const materials = new Materials(this.scene);
    const shadows = createSceneFoundation(this.scene, materials);
    const player = new Player(this.scene, materials);
    shadows.addShadowCaster(player.body);
    const world = new World(this.scene, materials, shadows);
    this.camera = new CameraController(this.scene, canvas, player);
    this.interaction = new InteractionSystem(state, player, materials);
    for (const asset of world.assets) {
      if (asset.interactable) this.interaction.register(asset.root, asset.interactable, asset.highlightMeshes);
    }

    window.addEventListener("resize", () => this.engine.resize());
  }

  start(): void {
    this.engine.runRenderLoop(() => {
      const deltaSeconds = this.engine.getDeltaTime() / 1000;
      this.camera.update(deltaSeconds);
      this.interaction.update();
      this.ticker.update(deltaSeconds, this.state);
      this.scene.render();
    });
  }
}
