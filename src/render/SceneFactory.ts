import { Color3, DirectionalLight, HemisphericLight, Mesh, MeshBuilder, Scene, ShadowGenerator, StandardMaterial, Vector3 } from "@babylonjs/core";
import type { Materials } from "./Materials";

export function createSceneFoundation(scene: Scene, materials: Materials): ShadowGenerator {
  scene.clearColor.set(0.015, 0.018, 0.028, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogColor = new Color3(0.04, 0.08, 0.07);
  scene.fogDensity = 0.012;
  createPainterlyNightSky(scene);

  const ambient = new HemisphericLight("forestAmbient", new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.48;
  ambient.diffuse = new Color3(0.38, 0.52, 0.62);
  ambient.groundColor = new Color3(0.05, 0.15, 0.09);

  const sun = new DirectionalLight("warmMoonlitSun", new Vector3(-0.45, -0.9, 0.35), scene);
  sun.intensity = 1.15;
  sun.diffuse = new Color3(1, 0.68, 0.32);
  sun.position = new Vector3(14, 24, -12);
  const shadows = new ShadowGenerator(2048, sun);
  shadows.useBlurExponentialShadowMap = true;
  shadows.blurKernel = 30;

  const ground = MeshBuilder.CreateGround("rainforestClearingGround", { width: 78, height: 78, subdivisions: 48 }, scene);
  ground.material = materials.ground;
  ground.receiveShadows = true;
  const positions = ground.getVerticesData("position");
  if (positions) {
    for (let index = 0; index < positions.length; index += 3) {
      const x = positions[index];
      const z = positions[index + 2];
      positions[index + 1] = Math.sin(x * 0.25) * 0.08 + Math.cos(z * 0.2) * 0.07;
    }
    ground.updateVerticesData("position", positions);
  }

  const river = MeshBuilder.CreateGround("riverStrip", { width: 18, height: 80, subdivisions: 24 }, scene);
  river.material = materials.water;
  river.position.x = -18;
  river.position.y = 0.055;
  river.rotation.z = 0.08;

  const bankA = MeshBuilder.CreateGround("riverBankA", { width: 2.2, height: 78, subdivisions: 8 }, scene);
  bankA.material = materials.clay;
  bankA.position.set(-8.8, 0.06, 0);
  bankA.rotation.z = 0.08;
  const bankB = bankA.clone("riverBankB");
  if (bankB) bankB.position.x = -27.2;

  for (let i = 0; i < 180; i += 1) createGrassClump(scene, materials, i);
  for (let i = 0; i < 54; i += 1) createBackgroundTree(scene, materials, shadows, i);
  for (let i = 0; i < 32; i += 1) createFern(scene, materials, i);
  for (let i = 0; i < 36; i += 1) createStar(scene, i);

  return shadows;
}

function createGrassClump(scene: Scene, materials: Materials, i: number): void {
  const grass = MeshBuilder.CreateCylinder(`grassClump${i}`, { height: 0.35 + (i % 5) * 0.09, diameterTop: 0.02, diameterBottom: 0.11, tessellation: 5 }, scene);
  grass.material = materials.grass;
  const angle = i * 2.399;
  const radius = 5 + ((i * 3.7) % 31);
  grass.position = new Vector3(Math.cos(angle) * radius + 4, 0.2, Math.sin(angle) * radius);
  grass.rotation.z = Math.sin(i) * 0.24;
}

function createBackgroundTree(scene: Scene, materials: Materials, shadows: ShadowGenerator, i: number): void {
  const angle = (i / 38) * Math.PI * 2;
  const radius = 25 + (i % 5) * 2.3;
  const trunk = MeshBuilder.CreateCylinder(`backgroundTrunk${i}`, { height: 5 + (i % 4), diameterTop: 0.28, diameterBottom: 0.7, tessellation: 7 }, scene);
  trunk.material = materials.bark;
  trunk.position = new Vector3(Math.cos(angle) * radius + 2, trunk.getBoundingInfo().boundingBox.extendSize.y, Math.sin(angle) * radius);
  const canopy = MeshBuilder.CreateSphere(`backgroundCanopy${i}`, { diameter: 4.5 + (i % 3), segments: 10 }, scene);
  canopy.material = materials.distantLeaf;
  canopy.position = trunk.position.add(new Vector3(0, 4.2 + (i % 4) * 0.45, 0));
  canopy.scaling.y = 0.72;
  shadows.addShadowCaster(trunk);
  shadows.addShadowCaster(canopy);
}

function createFern(scene: Scene, materials: Materials, i: number): void {
  const angle = i * 1.91;
  const radius = 7 + (i % 9) * 2.1;
  const root = new Vector3(Math.cos(angle) * radius, 0.09, Math.sin(angle) * radius + 2);
  for (let leaf = 0; leaf < 5; leaf += 1) {
    const blade = MeshBuilder.CreateGround(`fernLeaf${i}-${leaf}`, { width: 0.25, height: 1.3 }, scene);
    blade.material = materials.grass;
    blade.position = root.add(new Vector3(Math.cos(leaf) * 0.12, 0.06, Math.sin(leaf) * 0.12));
    blade.rotation.x = Math.PI / 2.8;
    blade.rotation.y = (leaf / 5) * Math.PI * 2;
  }
}


function createPainterlyNightSky(scene: Scene): void {
  const skydome = MeshBuilder.CreateBox("proceduralNightSky", { size: 900, sideOrientation: Mesh.BACKSIDE }, scene);
  skydome.isPickable = false;
  const sky = new StandardMaterial("proceduralNightSkyMaterial", scene);
  sky.diffuseColor = new Color3(0.018, 0.025, 0.05);
  sky.emissiveColor = new Color3(0.025, 0.04, 0.07);
  sky.disableLighting = true;
  skydome.material = sky;

  const horizon = MeshBuilder.CreateCylinder("mistyHorizonBand", { height: 0.08, diameter: 520, tessellation: 96 }, scene);
  horizon.position.y = 12;
  horizon.scaling.y = 80;
  horizon.isPickable = false;
  const horizonMaterial = new StandardMaterial("mistyHorizonMaterial", scene);
  horizonMaterial.diffuseColor = new Color3(0.08, 0.18, 0.14);
  horizonMaterial.emissiveColor = new Color3(0.04, 0.11, 0.09);
  horizonMaterial.alpha = 0.34;
  horizonMaterial.disableLighting = true;
  horizon.material = horizonMaterial;
}

function createStar(scene: Scene, i: number): void {
  const star = MeshBuilder.CreateSphere(`softStar${i}`, { diameter: 0.08 + (i % 4) * 0.025, segments: 6 }, scene);
  const material = new StandardMaterial(`softStarMaterial${i}`, scene);
  material.emissiveColor = new Color3(0.8, 0.9, 1);
  material.diffuseColor = new Color3(0.8, 0.9, 1);
  material.disableLighting = true;
  star.material = material;
  const angle = i * 2.399;
  const radius = 90 + (i % 8) * 12;
  star.position = new Vector3(Math.cos(angle) * radius, 32 + (i % 7) * 7, Math.sin(angle) * radius);
  star.isPickable = false;
}
