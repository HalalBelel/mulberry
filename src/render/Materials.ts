import { Color3, PBRMaterial, Scene, StandardMaterial } from "@babylonjs/core";

export class Materials {
  readonly ground: StandardMaterial;
  readonly grass: StandardMaterial;
  readonly distantLeaf: StandardMaterial;
  readonly bark: StandardMaterial;
  readonly leaves: StandardMaterial;
  readonly berry: StandardMaterial;
  readonly stone: StandardMaterial;
  readonly clay: StandardMaterial;
  readonly water: PBRMaterial;
  readonly player: StandardMaterial;
  readonly hand: StandardMaterial;
  readonly flame: StandardMaterial;
  readonly ember: StandardMaterial;
  readonly smoke: StandardMaterial;
  readonly highlight: StandardMaterial;

  constructor(scene: Scene) {
    this.ground = this.standard(scene, "ground", new Color3(0.22, 0.54, 0.2));
    this.grass = this.standard(scene, "grass", new Color3(0.18, 0.62, 0.24));
    this.distantLeaf = this.standard(scene, "distantLeaf", new Color3(0.04, 0.28, 0.11));
    this.bark = this.standard(scene, "bark", new Color3(0.28, 0.16, 0.09));
    this.leaves = this.standard(scene, "leaves", new Color3(0.04, 0.36, 0.13));
    this.berry = this.standard(scene, "berry", new Color3(0.5, 0.02, 0.34));
    this.stone = this.standard(scene, "stone", new Color3(0.46, 0.48, 0.46));
    this.clay = this.standard(scene, "clay", new Color3(0.62, 0.28, 0.16));
    this.player = this.standard(scene, "player", new Color3(0.95, 0.8, 0.46));
    this.hand = this.standard(scene, "hand", new Color3(0.62, 0.42, 0.28));
    this.flame = this.standard(scene, "flame", new Color3(1, 0.45, 0.08));
    this.flame.emissiveColor = new Color3(1, 0.34, 0.04);
    this.ember = this.standard(scene, "ember", new Color3(0.16, 0.07, 0.035));
    this.ember.emissiveColor = new Color3(0.6, 0.12, 0.02);
    this.smoke = this.standard(scene, "smoke", new Color3(0.45, 0.48, 0.46));
    this.smoke.alpha = 0.35;
    this.highlight = this.standard(scene, "highlight", new Color3(1, 0.94, 0.45));
    this.highlight.emissiveColor = new Color3(0.35, 0.28, 0.05);

    this.water = new PBRMaterial("water", scene);
    this.water.albedoColor = new Color3(0.03, 0.34, 0.42);
    this.water.emissiveColor = new Color3(0.01, 0.07, 0.08);
    this.water.alpha = 0.72;
    this.water.metallic = 0;
    this.water.roughness = 0.08;
  }

  private standard(scene: Scene, name: string, color: Color3): StandardMaterial {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = color;
    material.specularColor = new Color3(0.08, 0.08, 0.08);
    return material;
  }
}
