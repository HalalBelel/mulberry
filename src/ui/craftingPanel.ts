import { recipes } from "../data/recipes";
import { resourceLabels } from "../data/resources";
import { craftRecipe } from "../game/actions";
import type { GameState } from "../game/GameState";
import type { ResourceKey } from "../game/resourceTypes";

export function renderCraftingPanel(state: GameState): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel crafting-panel";
  panel.innerHTML = `<h2>Crafting</h2>`;
  for (const recipe of recipes) {
    const locked = recipe.requiresBowDrill === true && !state.bowDrillUnlocked;
    const crafted = (recipe.id === "bowDrill" && state.bowDrillUnlocked) || (recipe.id === "firePit" && state.firePitBuilt);
    const card = document.createElement("article");
    card.className = `card ${locked ? "locked" : ""}`;
    const costs = Object.entries(recipe.costs)
      .map(([key, value]) => `${value} ${resourceLabels[key as ResourceKey]}`)
      .join(" · ");
    const button = document.createElement("button");
    button.textContent = crafted ? "Made" : locked ? "Needs Bow Drill" : "Craft";
    button.disabled = crafted || locked || !state.canAfford(recipe.costs);
    button.addEventListener("click", () => craftRecipe(state, recipe.id));
    card.innerHTML = `<h3>${recipe.name}</h3><p>${recipe.description}</p><p class="cost">${costs}</p>`;
    card.append(button);
    panel.append(card);
  }
  const next = document.createElement("p");
  next.className = "hint";
  next.textContent = state.fireLit
    ? "The first fire is alive. Drying, charcoal, and pottery can grow from here."
    : state.firePitBuilt
      ? "Walk to the fire pit and press E to work the bow drill into flame."
      : state.bowDrillUnlocked
        ? "Next: craft a Stone Fire Pit, then light it with E."
        : "Gather fibre every second mulberry harvest to make the bow drill.";
  panel.append(next);
  return panel;
}
