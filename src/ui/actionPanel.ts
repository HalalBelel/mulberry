import type { GameState } from "../game/GameState";

export function renderActionPanel(state: GameState): HTMLElement | null {
  if (state.lastVisualAction === "none") return null;
  const panel = document.createElement("section");
  panel.className = `action-panel ${state.lastVisualAction}`;
  const content = {
    craftBowDrill: ["🪵", "You shave a spindle, bend a mulberry bow, and twist bark fibre into a cord."],
    buildFirePit: ["🪨", "You press clay between stones and tuck dry leaves under mulberry twigs."],
    lightFire: ["🔥", "The bow drill hums. Smoke becomes ember. Ember becomes flame."],
  }[state.lastVisualAction];
  panel.innerHTML = `<div class="action-icon">${content[0]}</div><p>${content[1]}</p>`;
  return panel;
}
