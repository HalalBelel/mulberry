import { recipes } from "../data/recipes";
import type { InteractableType } from "./resourceTypes";
import type { GameState } from "./GameState";

export function gatherSelected(state: GameState): void {
  const selected = state.selected;
  if (!selected || !selected.inRange) {
    state.addLog("Move closer to interact with the selected resource.");
    return;
  }
  gatherResource(state, selected.type);
}

export function gatherResource(state: GameState, type: InteractableType): void {
  if (type !== "water" && state.inventory.labour < 1) {
    state.addLog("You pause to rest. Labour returns gently at dawn in a later milestone.");
    return;
  }

  if (type === "mulberry") {
    state.spend({ labour: 1 });
    const fibreBonus = state.nextMulberryGatherIncludesFibre() ? 1 : 0;
    state.add({ mulberryTwigs: 2, mulberryFruit: 1, mulberryLeaves: 1, mulberryFibre: fibreBonus });
    state.addLog(fibreBonus > 0 ? "You gather mulberry twigs, fruit, leaves, and a strip of bark fibre." : "You gather mulberry twigs, fruit, and leaves.");
  }

  if (type === "stone") {
    state.spend({ labour: 1 });
    state.add({ stone: 2 });
    state.addLog("You collect two useful stones from the river-worn pile.");
  }

  if (type === "clay") {
    state.spend({ labour: 1 });
    state.add({ clay: 2 });
    state.addLog("You knead two handfuls of rich river clay.");
  }

  if (type === "water") {
    state.add({ water: 1 });
    state.addLog("You collect clear river water.");
  }

  state.notify();
}

export function craftBowDrill(state: GameState): void {
  const recipe = recipes.find((item) => item.id === "bowDrill");
  if (!recipe || state.bowDrillUnlocked) return;
  if (!state.spend(recipe.costs)) {
    state.addLog("You need more mulberry twigs and fibre for a bow drill.");
    return;
  }
  state.bowDrillUnlocked = true;
  state.addLog("You make a bow drill from mulberry twigs and fibre. Fire is now possible.");
  state.notify();
}

export function eatFruit(state: GameState): void {
  if (state.inventory.mulberryFruit < 1) return;
  state.spend({ mulberryFruit: 1 });
  state.add({ hunger: 8 });
  state.addLog("Sweet mulberries restore a little hunger.");
  state.notify();
}

export function drinkWater(state: GameState): void {
  if (state.inventory.water < 1) return;
  state.spend({ water: 1 });
  state.add({ thirst: 10 });
  state.addLog("Cool river water restores a little thirst.");
  state.notify();
}
