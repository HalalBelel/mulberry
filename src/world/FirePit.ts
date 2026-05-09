import { Mesh, MeshBuilder, PointLight, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import type { InteractableDefinition } from "../game/resourceTypes";
import type { Materials } from "../render/Materials";
import type { WorldAsset } from "./MulberryTree";

export class FirePitAsset implements WorldAsset {
  readonly root: TransformNode;
  readonly interactable: InteractableDefinition;
  readonly highlightMeshes: Mesh[];
  private readonly flame: Mesh;
  private readonly smoke: Mesh[] = [];
  private readonly light: PointLight;

  constructor(scene: Scene, materials: Materials, position: Vector3) {
    this.root = new TransformNode("firePitRoot", scene);
    this.root.position = position;
    this.root.metadata = { interactableId: "firePitNode" };
    this.interactable = {
      id: "firePitNode",
      type: "firePit",
      name: "Stone Fire Pit",
      actionLabel: "Light Fire with Bow Drill",
      radius: 2.5,
    };

    const stones: Mesh[] = [];
    for (let index = 0; index < 10; index += 1) {
      const angle = (index / 10) * Math.PI * 2;
      const stone = MeshBuilder.CreatePolyhedron(`firePitStone${index}`, { type: 2, size: 0.28 }, scene);
      stone.material = materials.stone;
      stone.position = new Vector3(Math.cos(angle) * 0.85, 0.18, Math.sin(angle) * 0.85);
      stone.scaling.y = 0.55;
      stone.parent = this.root;
      stones.push(stone);
    }

    const tinder = MeshBuilder.CreateCylinder("firePitTinder", { height: 0.16, diameter: 1.1, tessellation: 9 }, scene);
    tinder.material = materials.ember;
    tinder.position.y = 0.08;
    tinder.parent = this.root;
    stones.push(tinder);

    this.flame = MeshBuilder.CreateCylinder("firstFlame", { height: 1.1, diameterTop: 0.08, diameterBottom: 0.58, tessellation: 12 }, scene);
    this.flame.material = materials.flame;
    this.flame.position.y = 0.72;
    this.flame.parent = this.root;

    for (let index = 0; index < 4; index += 1) {
      const puff = MeshBuilder.CreateSphere(`smokePuff${index}`, { diameter: 0.38 + index * 0.12, segments: 8 }, scene);
      puff.material = materials.smoke;
      puff.position = new Vector3(Math.sin(index) * 0.12, 1.15 + index * 0.28, Math.cos(index) * 0.12);
      puff.parent = this.root;
      this.smoke.push(puff);
    }

    this.light = new PointLight("fireGlow", this.root.position.add(new Vector3(0, 0.8, 0)), scene);
    this.light.diffuse.set(1, 0.42, 0.16);
    this.light.intensity = 0;
    this.light.range = 7;
    this.highlightMeshes = stones;
    this.setBuilt(false);
    this.setLit(false);
  }

  setBuilt(built: boolean): void {
    this.root.setEnabled(built);
  }

  setLit(lit: boolean): void {
    this.flame.setEnabled(lit);
    for (const puff of this.smoke) puff.setEnabled(lit);
    this.light.intensity = lit ? 1.8 : 0;
  }

  animate(timeSeconds: number): void {
    if (!this.flame.isEnabled()) return;
    this.flame.scaling.y = 0.85 + Math.sin(timeSeconds * 8) * 0.16;
    this.flame.rotation.y += 0.035;
    for (const [index, puff] of this.smoke.entries()) {
      puff.position.y = 1.15 + index * 0.28 + Math.sin(timeSeconds * 1.3 + index) * 0.08;
      puff.scaling.setAll(1 + Math.sin(timeSeconds * 1.8 + index) * 0.08);
    }
  }
}
