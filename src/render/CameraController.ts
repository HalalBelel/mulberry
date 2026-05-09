import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";
import type { Player } from "../world/Player";

export class CameraController {
  readonly camera: ArcRotateCamera;
  private keys = new Set<string>();

  constructor(scene: Scene, canvas: HTMLCanvasElement, private readonly player: Player) {
    this.camera = new ArcRotateCamera("followCamera", Math.PI * 1.25, 1.05, 10, player.position, scene);
    this.camera.lowerBetaLimit = 0.55;
    this.camera.upperBetaLimit = 1.35;
    this.camera.lowerRadiusLimit = 6;
    this.camera.upperRadiusLimit = 15;
    this.camera.wheelDeltaPercentage = 0.01;
    this.camera.attachControl(canvas, true);

    window.addEventListener("keydown", (event) => this.keys.add(event.key.toLowerCase()));
    window.addEventListener("keyup", (event) => this.keys.delete(event.key.toLowerCase()));
  }

  update(deltaSeconds: number): void {
    const input = new Vector3(0, 0, 0);
    if (this.keys.has("w")) input.z += 1;
    if (this.keys.has("s")) input.z -= 1;
    if (this.keys.has("a")) input.x -= 1;
    if (this.keys.has("d")) input.x += 1;

    if (input.lengthSquared() > 0) {
      input.normalize();
      const forward = this.camera.getForwardRay().direction;
      forward.y = 0;
      forward.normalize();
      const right = Vector3.Cross(forward, Vector3.Up()).normalize();
      const move = forward.scale(input.z).add(right.scale(input.x)).normalize().scale(this.player.speed * deltaSeconds);
      this.player.root.position.addInPlace(move);
      this.player.root.position.x = Math.max(-30, Math.min(30, this.player.root.position.x));
      this.player.root.position.z = Math.max(-30, Math.min(30, this.player.root.position.z));
      this.player.root.rotation.y = Math.atan2(move.x, move.z);
    }

    this.camera.target = Vector3.Lerp(this.camera.target, this.player.position.add(new Vector3(0, 1, 0)), 0.12);
  }
}
