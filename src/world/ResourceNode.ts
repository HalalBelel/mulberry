import { Mesh, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import type { InteractableType } from "../game/resourceTypes";
import type { Materials } from "../render/Materials";
import type { WorldAsset } from "./MulberryTree";

function makeAsset(root: TransformNode, type: InteractableType, name: string, actionLabel: string, radius: number, highlightMeshes: Mesh[]): WorldAsset {
  const id = `${type}Node`;
  root.metadata = { interactableId: id };
  return { root, highlightMeshes, interactable: { id, type, name, actionLabel, radius } };
}

export function createStoneNode(scene: Scene, materials: Materials, position: Vector3): WorldAsset {
  const root = new TransformNode("stoneNodeRoot", scene);
  root.position = position;
  const rocks: Mesh[] = [];
  for (let index = 0; index < 6; index += 1) {
    const rock = MeshBuilder.CreatePolyhedron(`riverStone${index}`, { type: 2, size: 0.55 + (index % 3) * 0.12 }, scene);
    rock.material = materials.stone;
    rock.position = new Vector3(Math.cos(index) * 0.55, 0.22, Math.sin(index * 1.7) * 0.42);
    rock.rotation = new Vector3(index * 0.3, index * 0.8, index * 0.2);
    rock.scaling.y = 0.55;
    rock.parent = root;
    rocks.push(rock);
  }
  return makeAsset(root, "stone", "River Stone Pile", "Gather Stone", 2.4, rocks);
}

export function createClayPatch(scene: Scene, materials: Materials, position: Vector3): WorldAsset {
  const root = new TransformNode("clayPatchRoot", scene);
  root.position = position;
  const patch = MeshBuilder.CreateDisc("clayPatch", { radius: 1.25, tessellation: 32 }, scene);
  patch.material = materials.clay;
  patch.rotation.x = Math.PI / 2;
  patch.position.y = 0.025;
  patch.scaling.x = 1.5;
  patch.parent = root;
  return makeAsset(root, "clay", "River Clay Patch", "Gather Clay", 2.5, [patch]);
}

export function createWaterNode(scene: Scene, materials: Materials, position: Vector3): WorldAsset {
  const root = new TransformNode("waterNodeRoot", scene);
  root.position = position;
  const marker = MeshBuilder.CreateDisc("waterInteractionRipple", { radius: 1.1, tessellation: 40 }, scene);
  marker.material = materials.water;
  marker.rotation.x = Math.PI / 2;
  marker.position.y = 0.045;
  marker.parent = root;
  return makeAsset(root, "water", "Clear River Water", "Collect Water", 3.0, [marker]);
}
