import "@babylonjs/loaders/glTF";
import { Color3, Constants, Material, Mesh, MeshBuilder, PBRMaterial, Scene, SceneLoader, Texture, TransformNode, Vector3 } from "@babylonjs/core";

interface RemoteModelPlacement {
  assetId: string;
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
  useGLTFLightFalloff?: boolean;
  maxSimultaneousLights?: number;
  needAlphaBlending?: () => boolean;
  needAlphaTesting?: () => boolean;
};

interface ResolvedRemoteModel extends RemoteModelPlacement {
  rootUrl: string;
  fileName: string;
}

const remoteNatureModels: RemoteModelPlacement[] = [
  model("fern_02", new Vector3(5.2, 0, -2.6), 0.4, 1.7),
  model("fern_02", new Vector3(-2.8, 0, -5.1), 2.6, 1.35),
  model("fern_02", new Vector3(8.4, 0, 5.8), 4.3, 1.55),
  model("mossy_rock", new Vector3(-6.8, 0, 1.8), 1.2, 1.2),
  model("mossy_rock", new Vector3(6.6, 0, 7.1), 2.2, 0.9),
  model("tree_stump_02", new Vector3(0.4, 0, 6.4), 0.9, 1.05),
];

function model(assetId: string, position: Vector3, rotationY: number, scale: number): RemoteModelPlacement {
  return { assetId, position, rotationY, scale };
}

export class RemotePhotorealAssets {
  private readonly roots: TransformNode[] = [];
  private readonly fallbackMaterial: PBRMaterial;

  constructor(private readonly scene: Scene) {
    this.fallbackMaterial = new PBRMaterial("photoscanFallbackLeafMaterial", scene);
    this.fallbackMaterial.albedoColor = new Color3(0.07, 0.28, 0.1);
    this.fallbackMaterial.roughness = 0.88;
    this.fallbackMaterial.metallic = 0;
    this.createImmediatePhotorealFallbacks();
  }

  async load(): Promise<void> {
    const results = await Promise.allSettled(remoteNatureModels.map((placement) => this.loadPlacement(placement)));
    const successes = results.filter((result) => result.status === "fulfilled").length;
    const failures = results.length - successes;
    console.info(`Mulberry Alone: streamed ${successes}/${results.length} remote photoreal nature model placement(s).`);
    if (failures > 0) {
      console.info("Mulberry Alone: remote model streaming failed for some assets; visible high-detail procedural fallbacks remain active.");
    }
  }

  update(timeSeconds: number): void {
    for (const [index, root] of this.roots.entries()) {
      root.rotation.y += Math.sin(timeSeconds * 0.18 + index) * 0.0008;
    }
  }

  private async loadPlacement(placement: RemoteModelPlacement): Promise<void> {
    const resolved = await this.resolvePolyHavenModel(placement);
    const result = await SceneLoader.ImportMeshAsync("", resolved.rootUrl, resolved.fileName, this.scene);
    const root = new TransformNode(`remotePhotoreal-${placement.assetId}`, this.scene);
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

  private async resolvePolyHavenModel(placement: RemoteModelPlacement): Promise<ResolvedRemoteModel> {
    const response = await fetch(`https://api.polyhaven.com/files/${placement.assetId}`);
    if (!response.ok) throw new Error(`Poly Haven files lookup failed for ${placement.assetId}`);
    const files = (await response.json()) as unknown;
    const url = findModelUrl(files);
    if (!url) throw new Error(`No glTF/glB URL found for ${placement.assetId}`);
    const splitIndex = url.lastIndexOf("/");
    return {
      ...placement,
      rootUrl: url.slice(0, splitIndex + 1),
      fileName: url.slice(splitIndex + 1),
    };
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
      importedMaterial.useGLTFLightFalloff = true;
      importedMaterial.maxSimultaneousLights = 8;

      for (const slot of textureSlots) {
        const texture = importedMaterial[slot];
        if (texture && !texture.name.includes("Ground")) {
          texture.updateSamplingMode(Texture.TRILINEAR_SAMPLINGMODE);
        }
      }
    }
  }

  private createImmediatePhotorealFallbacks(): void {
    for (const [index, placement] of remoteNatureModels.entries()) {
      if (placement.assetId.includes("fern")) this.createFallbackFern(placement, index);
      if (placement.assetId.includes("rock")) this.createFallbackMossyRock(placement, index);
      if (placement.assetId.includes("stump")) this.createFallbackStump(placement, index);
    }
  }

  private createFallbackFern(placement: RemoteModelPlacement, index: number): void {
    const root = this.createFallbackRoot(placement, `fallbackFern${index}`);
    for (let leaf = 0; leaf < 18; leaf += 1) {
      const blade = MeshBuilder.CreatePlane(`fallbackFernLeaf${index}-${leaf}`, { width: 0.24, height: 1.45 + (leaf % 4) * 0.16 }, this.scene);
      blade.material = this.fallbackMaterial;
      blade.parent = root;
      blade.position = new Vector3(Math.cos(leaf) * 0.18, 0.42 + (leaf % 5) * 0.025, Math.sin(leaf) * 0.18);
      blade.rotation.x = Math.PI / 2.45;
      blade.rotation.y = (leaf / 18) * Math.PI * 2;
      blade.rotation.z = Math.sin(leaf * 2.1) * 0.32;
    }
    this.roots.push(root);
  }

  private createFallbackMossyRock(placement: RemoteModelPlacement, index: number): void {
    const root = this.createFallbackRoot(placement, `fallbackMossyRock${index}`);
    const rock = MeshBuilder.CreatePolyhedron(`fallbackPhotoscanRock${index}`, { type: 2, size: 1.25 }, this.scene);
    const material = new PBRMaterial(`fallbackMossyRockMaterial${index}`, this.scene);
    material.albedoColor = new Color3(0.18, 0.22, 0.17);
    material.roughness = 0.94;
    rock.material = material;
    rock.parent = root;
    rock.scaling.set(1.4, 0.62, 1.05);
    for (let tuft = 0; tuft < 10; tuft += 1) {
      const moss = MeshBuilder.CreatePlane(`fallbackRockMoss${index}-${tuft}`, { width: 0.36, height: 0.22 }, this.scene);
      moss.material = this.fallbackMaterial;
      moss.parent = root;
      moss.position = new Vector3(Math.sin(tuft) * 0.55, 0.5 + Math.sin(tuft * 1.7) * 0.12, Math.cos(tuft) * 0.38);
      moss.rotation.y = tuft;
      moss.rotation.x = Math.PI / 2.6;
    }
    this.roots.push(root);
  }

  private createFallbackStump(placement: RemoteModelPlacement, index: number): void {
    const root = this.createFallbackRoot(placement, `fallbackStump${index}`);
    const stump = MeshBuilder.CreateCylinder(`fallbackPhotoscanStump${index}`, { height: 1.25, diameterTop: 0.75, diameterBottom: 1.05, tessellation: 12 }, this.scene);
    const material = new PBRMaterial(`fallbackStumpMaterial${index}`, this.scene);
    material.albedoColor = new Color3(0.25, 0.14, 0.075);
    material.roughness = 0.86;
    stump.material = material;
    stump.parent = root;
    stump.position.y = 0.62;
    this.roots.push(root);
  }

  private createFallbackRoot(placement: RemoteModelPlacement, name: string): TransformNode {
    const root = new TransformNode(name, this.scene);
    root.position.copyFrom(placement.position);
    root.rotation.y = placement.rotationY;
    root.scaling.setAll(placement.scale);
    return root;
  }
}

function findModelUrl(value: unknown): string | null {
  if (typeof value === "string") {
    return /\.(gltf|glb)(\?|$)/i.test(value) ? value : null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findModelUrl(item);
      if (found) return found;
    }
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      const found = findModelUrl(item);
      if (found) return found;
    }
  }
  return null;
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
