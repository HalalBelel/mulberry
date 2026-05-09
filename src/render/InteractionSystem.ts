import { Mesh, TransformNode, Vector3 } from "@babylonjs/core";
import type { GameState, SelectionState } from "../game/GameState";
import type { InteractableDefinition } from "../game/resourceTypes";
import type { Player } from "../world/Player";
import { gatherSelected } from "../game/actions";
import type { Materials } from "./Materials";

interface RegisteredInteractable extends InteractableDefinition {
  root: TransformNode;
  highlightMeshes: Mesh[];
}

export class InteractionSystem {
  private readonly interactables: RegisteredInteractable[] = [];
  private activeId: string | null = null;

  constructor(private readonly state: GameState, private readonly player: Player, private readonly materials: Materials) {
    window.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "e") gatherSelected(this.state);
    });
  }

  register(root: TransformNode, interactable: InteractableDefinition, highlightMeshes: Mesh[]): void {
    this.interactables.push({ ...interactable, root, highlightMeshes });
  }

  update(): void {
    let nearest: SelectionState | null = null;
    let nearestSource: RegisteredInteractable | null = null;
    for (const item of this.interactables) {
      const distance = Vector3.Distance(this.player.position, item.root.getAbsolutePosition());
      if (!nearest || distance < nearest.distance) {
        nearest = { id: item.id, type: item.type, name: item.name, actionLabel: item.actionLabel, radius: item.radius, distance, inRange: distance <= item.radius };
        nearestSource = item;
      }
    }
    this.state.setSelected(nearest);
    if (nearestSource?.id !== this.activeId) {
      this.clearHighlights();
      this.activeId = nearestSource?.id ?? null;
      if (nearestSource) {
        for (const mesh of nearestSource.highlightMeshes) mesh.overlayColor = this.materials.highlight.diffuseColor;
      }
    }
    if (nearestSource) {
      for (const mesh of nearestSource.highlightMeshes) mesh.renderOverlay = nearest?.inRange ?? false;
    }
  }

  private clearHighlights(): void {
    for (const item of this.interactables) {
      for (const mesh of item.highlightMeshes) mesh.renderOverlay = false;
    }
  }
}
