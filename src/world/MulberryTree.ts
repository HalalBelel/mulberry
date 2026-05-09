import { Mesh, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import type { Materials } from "../render/Materials";
import type { InteractableDefinition } from "../game/resourceTypes";

export interface WorldAsset {
  root: TransformNode;
  interactable?: InteractableDefinition;
  highlightMeshes: Mesh[];
}

export function createMulberryTree(scene: Scene, materials: Materials, position: Vector3): WorldAsset {
  const root = new TransformNode("wildMulberryRoot", scene);
  root.position = position;

  const trunk = MeshBuilder.CreateCylinder("wildMulberryTrunk", { height: 3.2, diameterTop: 0.38, diameterBottom: 0.72, tessellation: 9 }, scene);
  trunk.material = materials.bark;
  trunk.position.y = 1.6;
  trunk.parent = root;

  const canopyPositions = [
    new Vector3(0, 3.25, 0),
    new Vector3(-0.85, 2.8, 0.2),
    new Vector3(0.95, 2.9, -0.05),
    new Vector3(0.1, 3.0, 0.9),
  ];
  const highlightMeshes: Mesh[] = [trunk];
  for (const [index, local] of canopyPositions.entries()) {
    const canopy = MeshBuilder.CreateSphere(`mulberryLeafCloud${index}`, { diameter: index === 0 ? 2.7 : 1.9, segments: 12 }, scene);
    canopy.material = materials.leaves;
    canopy.position = local;
    canopy.scaling.y = 0.72;
    canopy.parent = root;
    highlightMeshes.push(canopy);
  }

  const berrySpots = [
    [-0.8, 2.75, 1.02], [0.52, 2.55, 1.1], [1.06, 3.05, 0.34], [-1.02, 3.1, -0.22],
    [0.08, 3.45, 1.18], [0.8, 2.38, -0.72], [-0.36, 2.46, -0.96], [0.28, 3.76, -0.2],
  ];
  for (const [index, spot] of berrySpots.entries()) {
    const berry = MeshBuilder.CreateSphere(`mulberryBerry${index}`, { diameter: 0.16, segments: 8 }, scene);
    berry.material = materials.berry;
    berry.position = new Vector3(spot[0], spot[1], spot[2]);
    berry.parent = root;
  }

  root.metadata = { interactableId: "wildMulberry" };
  return {
    root,
    highlightMeshes,
    interactable: {
      id: "wildMulberry",
      type: "mulberry",
      name: "Wild Mulberry Tree",
      actionLabel: "Gather Wild Mulberry",
      radius: 3.2,
    },
  };
}
