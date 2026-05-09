import { Scene, ShadowGenerator, Vector3 } from "@babylonjs/core";
import type { GameState } from "../game/GameState";
import type { Materials } from "../render/Materials";
import { FirePitAsset } from "./FirePit";
import { createMulberryTree, type WorldAsset } from "./MulberryTree";
import { createClayPatch, createStoneNode, createWaterNode } from "./ResourceNode";

export class World {
  readonly assets: WorldAsset[];
  private readonly firePit: FirePitAsset;

  constructor(scene: Scene, materials: Materials, shadows: ShadowGenerator, private readonly state: GameState) {
    this.firePit = new FirePitAsset(scene, materials, new Vector3(1.8, 0, -1.5));
    this.assets = [
      createMulberryTree(scene, materials, new Vector3(3, 0, 3)),
      createStoneNode(scene, materials, new Vector3(-4, 0, 4)),
      createClayPatch(scene, materials, new Vector3(-12, 0, -2)),
      createWaterNode(scene, materials, new Vector3(-16, 0, -3)),
      this.firePit,
    ];

    for (const asset of this.assets) {
      for (const mesh of asset.highlightMeshes) {
        mesh.receiveShadows = true;
        shadows.addShadowCaster(mesh, true);
      }
    }
    this.syncFromState();
    state.subscribe(() => this.syncFromState());
  }

  update(timeSeconds: number): void {
    this.firePit.animate(timeSeconds);
  }

  private syncFromState(): void {
    this.firePit.setBuilt(this.state.firePitBuilt);
    this.firePit.setLit(this.state.fireLit);
  }
}
