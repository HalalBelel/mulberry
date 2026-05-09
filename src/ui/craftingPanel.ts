import { recipes } from "../data/recipes";
import { resourceLabels } from "../data/resources";
import { craftBowDrill } from "../game/actions";
import type { GameState } from "../game/GameState";
import type { ResourceKey } from "../game/resourceTypes";

export function renderCraftingPanel(state: GameState): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel crafting-panel";
  panel.innerHTML = `<h2>Crafting</h2>`;
  for (const recipe of recipes) {
    const card = document.createElement("article");
    card.className = "card";
    const costs = Object.entries(recipe.costs)
      .map(([key, value]) => `${value} ${resourceLabels[key as ResourceKey]}`)
      .join(" · ");
    const crafted = state.bowDrillUnlocked;
    const button = document.createElement("button");
    button.textContent = crafted ? "Crafted" : "Craft";
    button.disabled = crafted || !state.canAfford(recipe.costs);
    button.addEventListener("click", () => craftBowDrill(state));
    card.innerHTML = `<h3>${recipe.name}</h3><p>${recipe.description}</p><p class="cost">${costs}</p>`;
    card.append(button);
    panel.append(card);
  }
  const next = document.createElement("p");
  next.className = "hint";
  next.textContent = state.bowDrillUnlocked ? "Next unlock visible: Fire Pit. It is not buildable in Milestone 1." : "Gather fibre every second mulberry harvest to make the bow drill.";
  panel.append(next);
  return panel;
}
