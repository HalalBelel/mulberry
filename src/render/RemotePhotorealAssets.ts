import "@babylonjs/loaders/glTF";
import { Constants, Material, Mesh, Scene, SceneLoader, Texture, TransformNode, Vector3 } from "@babylonjs/core";

interface RemoteModelPlacement {
  name: string;
  rootUrl: string;
  fileName: string;
  position: Vector3;
  rotationY: number;
  scale: number;
}

type TextureSlot =
  | "diffuseTexture"
  | "albedoTexture"
  | "opacityTexture"
  | "emissiveTexture"
  | "bumpTexture"
  | "normalTexture"
  | "metallicTexture"
  | "roughnessTexture"
  | "reflectionTexture";

type MaterialWithTextureSlots = Material & Partial<Record<TextureSlot, Texture | null>> & {
  transparencyMode?: number | null;
  usePhysicalLightFalloff?: boolean;
  needAlphaBlending?: () => boolean;
  needAlphaTesting?: () => boolean;
};

const polyHavenBase = "https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k";

const remoteNatureModels: RemoteModelPlacement[] = [
  model("fern_02", new Vector3(5.2, 0, -2.6), 0.4, 1.7),
  model("fern_02", new Vector3(-2.8, 0, -5.1), 2.6, 1.35),
  model("fern_02", new Vector3(8.4, 0, 5.8), 4.3, 1.55),
  model("mossy_rock", new Vector3(-6.8, 0, 1.8), 1.2, 1.2),
  model("mossy_rock", new Vector3(6.6, 0, 7.1), 2.2, 0.9),
  model("tree_stump_02", new Vector3(0.4, 0, 6.4), 0.9, 1.05),
];

function model(assetId: string, position: Vector3, rotationY: number, scale: number): RemoteModelPlacement {
  return {
    name: assetId,
    rootUrl: `${polyHavenBase}/${assetId}/`,
    fileName: `${assetId}_1k.gltf`,
    position,
    rotationY,
    scale,
  };
}

export class RemotePhotorealAssets {
  private readonly roots: TransformNode[] = [];

  constructor(private readonly scene: Scene) {}

  async load(): Promise<void> {
    const results = await Promise.allSettled(remoteNatureModels.map((placement) => this.loadPlacement(placement)));
    const failures = results.filter((result) => result.status === "rejected").length;
    if (failures > 0) {
      console.info(`Mulberry Alone: ${failures} streamed photoreal asset(s) could not load; procedural fallback scenery remains active.`);
    }
  }

  update(timeSeconds: number): void {
    for (const [index, root] of this.roots.entries()) {
      root.rotation.y += Math.sin(timeSeconds * 0.18 + index) * 0.0008;
    }
  }

  private async loadPlacement(placement: RemoteModelPlacement): Promise<void> {
    const result = await SceneLoader.ImportMeshAsync("", placement.rootUrl, placement.fileName, this.scene);
    const root = new TransformNode(`remotePhotoreal-${placement.name}`, this.scene);
    root.position.copyFrom(placement.position);
    root.rotation.y = placement.rotationY;
    root.scaling.setAll(placement.scale);

    for (const mesh of result.meshes) {
      if (mesh instanceof Mesh) {
        mesh.parent = root;
        mesh.receiveShadows = true;
        mesh.isPickable = false;
      }
    }

    this.fixImportedMaterials();
    this.roots.push(root);
  }

  private fixImportedMaterials(): void {
    for (const material of this.scene.materials) {
      const importedMaterial = material as MaterialWithTextureSlots;
      importedMaterial.backFaceCulling = false;
      importedMaterial.alphaMode = Constants.ALPHA_DISABLE;
      importedMaterial.transparencyMode = null;
      importedMaterial.needAlphaBlending = () => false;
      importedMaterial.needAlphaTesting = () => true;
      importedMaterial.usePhysicalLightFalloff = false;

      for (const slot of textureSlots) {
        const texture = importedMaterial[slot];
        if (texture && !texture.name.includes("Ground")) {
          texture.updateSamplingMode(Texture.TRILINEAR_SAMPLINGMODE);
        }
      }
    }
  }
}

const textureSlots: TextureSlot[] = [
  "diffuseTexture",
  "albedoTexture",
  "opacityTexture",
  "emissiveTexture",
  "bumpTexture",
  "normalTexture",
  "metallicTexture",
  "roughnessTexture",
  "reflectionTexture",
];
