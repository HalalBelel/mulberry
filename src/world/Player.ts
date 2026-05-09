import { Mesh, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import type { Materials } from "../render/Materials";

export class Player {
  readonly root: TransformNode;
  readonly body: Mesh;
  readonly speed = 6;

  constructor(scene: Scene, materials: Materials) {
    this.root = new TransformNode("playerRoot", scene);
    this.root.position = new Vector3(0, 0, -4);
    this.body = MeshBuilder.CreateCapsule("playerBody", { height: 1.8, radius: 0.32 }, scene);
    this.body.material = materials.player;
    this.body.position.y = 0.9;
    this.body.parent = this.root;
  }

  get position(): Vector3 {
    return this.root.position;
  }
}
