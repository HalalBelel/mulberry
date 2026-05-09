import { Color3, HemisphericLight, MeshBuilder, Scene, ShadowGenerator, Vector3, DirectionalLight } from "@babylonjs/core";
import type { Materials } from "./Materials";

export function createSceneFoundation(scene: Scene, materials: Materials): ShadowGenerator {
  scene.clearColor.set(0.62, 0.78, 0.82, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogColor = new Color3(0.62, 0.76, 0.7);
  scene.fogDensity = 0.018;

  const ambient = new HemisphericLight("forestAmbient", new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.55;
  ambient.groundColor = new Color3(0.1, 0.24, 0.12);

  const sun = new DirectionalLight("warmSun", new Vector3(-0.45, -0.9, 0.35), scene);
  sun.intensity = 1.5;
  sun.diffuse = new Color3(1, 0.84, 0.56);
  sun.position = new Vector3(14, 22, -12);
  const shadows = new ShadowGenerator(1024, sun);
  shadows.useBlurExponentialShadowMap = true;
  shadows.blurKernel = 28;

  const ground = MeshBuilder.CreateGround("rainforestClearingGround", { width: 70, height: 70, subdivisions: 24 }, scene);
  ground.material = materials.ground;
  ground.receiveShadows = true;

  const river = MeshBuilder.CreateGround("riverStrip", { width: 18, height: 72, subdivisions: 8 }, scene);
  river.material = materials.water;
  river.position.x = -18;
  river.position.y = 0.035;
  river.rotation.z = 0.08;

  for (let i = 0; i < 80; i += 1) {
    const grass = MeshBuilder.CreateCylinder(`grassClump${i}`, { height: 0.4 + (i % 5) * 0.08, diameterTop: 0.03, diameterBottom: 0.12, tessellation: 5 }, scene);
    grass.material = materials.grass;
    const angle = i * 2.399;
    const radius = 7 + ((i * 3.7) % 24);
    grass.position = new Vector3(Math.cos(angle) * radius + 3, grass.getBoundingInfo().boundingBox.extendSize.y, Math.sin(angle) * radius);
    grass.rotation.z = Math.sin(i) * 0.24;
  }
  return shadows;
}
