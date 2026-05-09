import { Color3, DefaultRenderingPipeline, DirectionalLight, Engine, GlowLayer, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, UniversalCamera, Vector3, VolumetricLightScatteringPostProcess } from "@babylonjs/core";

export class AtmosphericEffects {
  private readonly sunDisc: Mesh;
  private readonly godRays?: VolumetricLightScatteringPostProcess;

  constructor(scene: Scene, engine: Engine, camera: UniversalCamera, sun: DirectionalLight) {
    const pipeline = new DefaultRenderingPipeline("cinematicPipeline", true, scene, [camera]);
    pipeline.imageProcessingEnabled = true;
    pipeline.imageProcessing.ditheringEnabled = true;
    pipeline.imageProcessing.toneMappingEnabled = true;
    pipeline.imageProcessing.toneMappingType = 1;
    pipeline.imageProcessing.exposure = 1.42;
    pipeline.imageProcessing.contrast = 1.18;
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.18;
    pipeline.bloomWeight = 0.36;
    pipeline.bloomKernel = 48;
    pipeline.fxaaEnabled = true;

    const glow = new GlowLayer("warmBioluminescentGlow", scene);
    glow.intensity = 0.42;

    this.sunDisc = MeshBuilder.CreateSphere("volumetricSunDisc", { diameter: 5.5, segments: 24 }, scene);
    this.sunDisc.position = sun.position.add(new Vector3(-24, -4, 14));
    this.sunDisc.isPickable = false;
    const sunMaterial = new StandardMaterial("volumetricSunMaterial", scene);
    sunMaterial.diffuseColor = new Color3(1, 0.52, 0.18);
    sunMaterial.emissiveColor = new Color3(1, 0.38, 0.08);
    sunMaterial.disableLighting = true;
    this.sunDisc.material = sunMaterial;

    if (engine.getCaps().texelFetch && engine.getCaps().colorBufferFloat && engine.getCaps().blendFloat) {
      this.godRays = new VolumetricLightScatteringPostProcess("forestGodRays", 0.55, camera, this.sunDisc, 80, Texture.BILINEAR_SAMPLINGMODE, engine, false, scene);
      this.godRays.exposure = 0.18;
      this.godRays.decay = 0.968;
      this.godRays.weight = 0.42;
      this.godRays.density = 0.72;
    }

    createMistSheets(scene);
  }

  update(timeSeconds: number): void {
    this.sunDisc.position.y += Math.sin(timeSeconds * 0.08) * 0.002;
    if (this.godRays) {
      this.godRays.exposure = 0.15 + Math.sin(timeSeconds * 0.2) * 0.025;
    }
  }
}

function createMistSheets(scene: Scene): void {
  const mistMaterial = new StandardMaterial("softLayeredMistMaterial", scene);
  mistMaterial.diffuseColor = new Color3(0.52, 0.72, 0.62);
  mistMaterial.emissiveColor = new Color3(0.04, 0.1, 0.08);
  mistMaterial.alpha = 0.12;
  mistMaterial.disableLighting = true;
  mistMaterial.backFaceCulling = false;

  for (let index = 0; index < 10; index += 1) {
    const sheet = MeshBuilder.CreatePlane(`softMistSheet${index}`, { width: 34 + index * 3, height: 4.8 }, scene);
    sheet.material = mistMaterial;
    sheet.position = new Vector3(Math.sin(index * 1.7) * 16, 1.8 + (index % 3) * 0.55, -18 + index * 4.8);
    sheet.rotation.y = Math.PI / 2 + Math.sin(index) * 0.35;
    sheet.isPickable = false;
  }
}
