import { Mesh, MeshBuilder, Node, Scene, Vector3 } from "@babylonjs/core";
import type { GameState } from "../game/GameState";
import type { Materials } from "./Materials";

export class FirstPersonView {
  private readonly leftHand: Mesh;
  private readonly rightHand: Mesh;
  private readonly bow: Mesh;
  private readonly spindle: Mesh;
  private readonly ember: Mesh;

  constructor(scene: Scene, camera: Node, materials: Materials, private readonly state: GameState) {
    this.leftHand = MeshBuilder.CreateSphere("leftHand", { diameter: 0.22, segments: 10 }, scene);
    this.rightHand = MeshBuilder.CreateSphere("rightHand", { diameter: 0.22, segments: 10 }, scene);
    this.bow = MeshBuilder.CreateTorus("heldBowDrillBow", { diameter: 0.62, thickness: 0.025, tessellation: 24 }, scene);
    this.spindle = MeshBuilder.CreateCylinder("heldBowDrillSpindle", { height: 0.58, diameter: 0.045, tessellation: 8 }, scene);
    this.ember = MeshBuilder.CreateSphere("heldEmberGlow", { diameter: 0.08, segments: 8 }, scene);

    this.leftHand.material = materials.hand;
    this.rightHand.material = materials.hand;
    this.bow.material = materials.bark;
    this.spindle.material = materials.bark;
    this.ember.material = materials.flame;

    for (const mesh of [this.leftHand, this.rightHand, this.bow, this.spindle, this.ember]) {
      mesh.parent = camera;
      mesh.alwaysSelectAsActiveMesh = true;
    }

    this.leftHand.position = new Vector3(-0.32, -0.32, 0.76);
    this.rightHand.position = new Vector3(0.32, -0.34, 0.74);
    this.bow.position = new Vector3(0.02, -0.28, 0.92);
    this.bow.rotation.z = Math.PI / 2;
    this.spindle.position = new Vector3(0.04, -0.24, 0.82);
    this.spindle.rotation.x = Math.PI / 2;
    this.ember.position = new Vector3(0.04, -0.47, 0.86);
  }

  update(timeSeconds: number): void {
    const hasTool = this.state.bowDrillUnlocked || this.state.lastVisualAction === "craftBowDrill" || this.state.lastVisualAction === "lightFire";
    this.leftHand.setEnabled(hasTool);
    this.rightHand.setEnabled(hasTool);
    this.bow.setEnabled(hasTool);
    this.spindle.setEnabled(hasTool);
    this.ember.setEnabled(this.state.lastVisualAction === "lightFire" || this.state.fireLit);

    const working = this.state.lastVisualAction === "craftBowDrill" || this.state.lastVisualAction === "lightFire";
    const pulse = working ? Math.sin(timeSeconds * 22) * 0.12 : Math.sin(timeSeconds * 2) * 0.025;
    this.bow.position.x = pulse;
    this.spindle.rotation.y += working ? 0.35 : 0.03;
    this.ember.scaling.setAll(1 + Math.sin(timeSeconds * 12) * 0.18);
  }
}
