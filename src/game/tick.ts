import type { GameState } from "./GameState";

export class GameTicker {
  private elapsed = 0;

  update(deltaSeconds: number, state: GameState): void {
    this.elapsed += deltaSeconds;
    if (this.elapsed < 8) return;
    this.elapsed = 0;
    state.inventory.hunger = Math.max(0, state.inventory.hunger - 1);
    state.inventory.thirst = Math.max(0, state.inventory.thirst - 1);
    state.notify();
  }
}
