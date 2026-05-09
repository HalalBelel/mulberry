import { Color3, Mesh, MeshBuilder, PointLight, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";

interface Firefly {
  root: TransformNode;
  glow: Mesh;
  light: PointLight;
  seed: number;
  radius: number;
  speed: number;
  center: Vector3;
}

export class FireflySystem {
  private readonly fireflies: Firefly[] = [];

  constructor(scene: Scene, count = 34) {
    const glowMaterial = new StandardMaterial("fireflyGlowMaterial", scene);
    glowMaterial.diffuseColor = new Color3(1, 0.62, 0.18);
    glowMaterial.emissiveColor = new Color3(1, 0.48, 0.08);
    glowMaterial.disableLighting = true;

    for (let index = 0; index < count; index += 1) {
      const root = new TransformNode(`fireflyRoot${index}`, scene);
      const glow = MeshBuilder.CreateSphere(`fireflyGlow${index}`, { diameter: 0.085 + (index % 3) * 0.02, segments: 8 }, scene);
      glow.material = glowMaterial;
      glow.parent = root;
      const light = new PointLight(`fireflyLight${index}`, Vector3.Zero(), scene);
      light.diffuse = new Color3(1, 0.48, 0.12);
      light.range = 2.4;
      light.intensity = 0.55;
      light.parent = root;
      this.fireflies.push({
        root,
        glow,
        light,
        seed: index * 19.713,
        radius: 2.5 + (index % 7) * 0.7,
        speed: 0.18 + (index % 5) * 0.035,
        center: new Vector3(Math.sin(index * 2.17) * 14, 1.1 + (index % 4) * 0.35, Math.cos(index * 1.73) * 12),
      });
    }
  }

  update(timeSeconds: number): void {
    for (const firefly of this.fireflies) {
      const t = timeSeconds * firefly.speed + firefly.seed;
      firefly.root.position.set(
        firefly.center.x + Math.sin(t * 1.7) * firefly.radius + Math.cos(t * 0.51) * 0.8,
        firefly.center.y + Math.sin(t * 2.9) * 0.46,
        firefly.center.z + Math.cos(t * 1.3) * firefly.radius,
      );
      const pulse = 0.45 + Math.max(0, Math.sin(timeSeconds * 4.2 + firefly.seed)) * 1.1;
      firefly.light.intensity = pulse;
      firefly.glow.scaling.setAll(0.8 + pulse * 0.35);
    }
  }
}
