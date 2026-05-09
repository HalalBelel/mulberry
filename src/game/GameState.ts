import { initialInventory } from "../data/resources";
import type { InteractableDefinition, Inventory, ResourceKey } from "./resourceTypes";

export interface SelectionState extends InteractableDefinition {
  distance: number;
  inRange: boolean;
}

type Listener = () => void;

export type VisualAction = "none" | "craftBowDrill" | "buildFirePit" | "lightFire";

export class GameState {
  public inventory: Inventory = { ...initialInventory };
  public bowDrillUnlocked = false;
  public firePitBuilt = false;
  public fireLit = false;
  public selected: SelectionState | null = null;
  public lastVisualAction: VisualAction = "none";
  public readonly log: string[] = [
    "You wake beside a rainforest river. Wild mulberries bend over the clearing.",
  ];

  private listeners = new Set<Listener>();
  private mulberryGatherCount = 0;
  private visualTimeout: number | undefined;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(): void {
    for (const listener of this.listeners) listener();
  }

  setSelected(selected: SelectionState | null): void {
    const changed = this.selected?.id !== selected?.id || this.selected?.inRange !== selected?.inRange;
    this.selected = selected;
    if (changed) this.notify();
  }

  addLog(message: string): void {
    this.log.unshift(message);
    this.log.splice(8);
    this.notify();
  }

  showVisualAction(action: VisualAction): void {
    this.lastVisualAction = action;
    if (this.visualTimeout) window.clearTimeout(this.visualTimeout);
    this.visualTimeout = window.setTimeout(() => {
      this.lastVisualAction = "none";
      this.notify();
    }, 2200);
  }

  canAfford(costs: Partial<Record<ResourceKey, number>>): boolean {
    return Object.entries(costs).every(([key, cost]) => this.inventory[key as ResourceKey] >= (cost ?? 0));
  }

  spend(costs: Partial<Record<ResourceKey, number>>): boolean {
    if (!this.canAfford(costs)) return false;
    for (const [key, cost] of Object.entries(costs)) {
      this.inventory[key as ResourceKey] -= cost ?? 0;
    }
    return true;
  }

  add(resources: Partial<Record<ResourceKey, number>>): void {
    for (const [key, amount] of Object.entries(resources)) {
      const resource = key as ResourceKey;
      this.inventory[resource] += amount ?? 0;
      if (resource === "hunger" || resource === "thirst") this.inventory[resource] = Math.min(100, this.inventory[resource]);
    }
  }

  nextMulberryGatherIncludesFibre(): boolean {
    this.mulberryGatherCount += 1;
    return this.mulberryGatherCount % 2 === 0;
  }
}
