import { Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import type { Player } from "../world/Player";

export class CameraController {
  readonly camera: UniversalCamera;
  private readonly keys = new Set<string>();
  private yaw = 0;
  private pitch = 0;

  constructor(scene: Scene, private readonly canvas: HTMLCanvasElement, private readonly player: Player) {
    this.camera = new UniversalCamera("firstPersonCamera", player.position.add(new Vector3(0, 1.62, 0)), scene);
    this.camera.minZ = 0.05;
    this.camera.fov = 1.12;
    this.camera.inputs.clear();
    scene.activeCamera = this.camera;

    canvas.addEventListener("click", () => {
      void canvas.requestPointerLock();
    });
    window.addEventListener("mousemove", (event) => this.look(event));
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
      const forward = new Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
      const right = new Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
      const move = forward.scale(input.z).add(right.scale(input.x)).normalize().scale(this.player.speed * deltaSeconds);
      this.player.root.position.addInPlace(move);
      this.player.root.position.x = Math.max(-32, Math.min(32, this.player.root.position.x));
      this.player.root.position.z = Math.max(-32, Math.min(32, this.player.root.position.z));
      this.player.root.rotation.y = this.yaw;
    }

    this.camera.position.copyFrom(this.player.position.add(new Vector3(0, 1.62, 0)));
    this.camera.rotation.set(this.pitch, this.yaw, 0);
  }

  private look(event: MouseEvent): void {
    if (document.pointerLockElement !== this.canvas) return;
    this.yaw += event.movementX * 0.0022;
    this.pitch += event.movementY * 0.0022;
    this.pitch = Math.max(-1.25, Math.min(1.15, this.pitch));
  }
}
