import { Color3, PBRMaterial, Scene, StandardMaterial } from "@babylonjs/core";

export class Materials {
  readonly ground: StandardMaterial;
  readonly grass: StandardMaterial;
  readonly bark: StandardMaterial;
  readonly leaves: StandardMaterial;
  readonly berry: StandardMaterial;
  readonly stone: StandardMaterial;
  readonly clay: StandardMaterial;
  readonly water: PBRMaterial;
  readonly player: StandardMaterial;
  readonly highlight: StandardMaterial;

  constructor(scene: Scene) {
    this.ground = this.standard(scene, "ground", new Color3(0.18, 0.42, 0.16));
    this.grass = this.standard(scene, "grass", new Color3(0.24, 0.62, 0.22));
    this.bark = this.standard(scene, "bark", new Color3(0.36, 0.2, 0.11));
    this.leaves = this.standard(scene, "leaves", new Color3(0.08, 0.45, 0.17));
    this.berry = this.standard(scene, "berry", new Color3(0.42, 0.04, 0.34));
    this.stone = this.standard(scene, "stone", new Color3(0.45, 0.48, 0.5));
    this.clay = this.standard(scene, "clay", new Color3(0.62, 0.28, 0.16));
    this.player = this.standard(scene, "player", new Color3(0.95, 0.8, 0.46));
    this.highlight = this.standard(scene, "highlight", new Color3(1, 0.94, 0.45));
    this.highlight.emissiveColor = new Color3(0.35, 0.28, 0.05);

    this.water = new PBRMaterial("water", scene);
    this.water.albedoColor = new Color3(0.08, 0.42, 0.5);
    this.water.alpha = 0.68;
    this.water.metallic = 0;
    this.water.roughness = 0.18;
  }

  private standard(scene: Scene, name: string, color: Color3): StandardMaterial {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = color;
    material.specularColor = new Color3(0.08, 0.08, 0.08);
    return material;
  }
}
