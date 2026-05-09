import { Scene, ShadowGenerator, Vector3 } from "@babylonjs/core";
import type { Materials } from "../render/Materials";
import { createMulberryTree, type WorldAsset } from "./MulberryTree";
import { createClayPatch, createStoneNode, createWaterNode } from "./ResourceNode";

export class World {
  readonly assets: WorldAsset[];

  constructor(scene: Scene, materials: Materials, shadows: ShadowGenerator) {
    this.assets = [
      createMulberryTree(scene, materials, new Vector3(3, 0, 3)),
      createStoneNode(scene, materials, new Vector3(-4, 0, 4)),
      createClayPatch(scene, materials, new Vector3(-12, 0, -2)),
      createWaterNode(scene, materials, new Vector3(-16, 0, -3)),
    ];

    for (const asset of this.assets) {
      for (const mesh of asset.highlightMeshes) {
        mesh.receiveShadows = true;
        shadows.addShadowCaster(mesh, true);
      }
    }
  }
}
